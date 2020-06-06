const Extra = require('telegraf/extra');
const moment = require('moment');

const PhotoStorage = require('../PhotoStorage');

function createCaption(username, photo) {
  const date = moment(photo.dateTaken).format('DD.MM.YYYY HH:mm');

  const caption = [
    `👤 @${username.replace(/@/, '')}`,
    `📸 <a href="${photo.flickrUrl}">${photo.albumName}</a>`,
    `📅 ${date}`,
  ];

  return caption.join('\n');
}

module.exports.command = async function (ctx, username) {
  const faces = PhotoStorage.getFacesByTelegram(username);
  if (faces.length > 0) {
    const randomFace = faces[Math.floor(Math.random() * faces.length)];
    const photo = PhotoStorage.getPhotoById(randomFace.photoId);
    const caption = createCaption(username, photo);

    // example: https://github.com/telegraf/telegraf/blob/master/docs/examples/media-bot.js
    await ctx.replyWithPhoto(
      { url: photo.urlLarge },
      Extra.markup((m) =>
        m.inlineKeyboard([m.callbackButton('Наступне фото ➡️', 'next_photo')]),
      )
        .caption(caption)
        .HTML(),
    );
  } else {
    ctx.replyWithMarkdown(
      `😢 На жаль, фото із ${
        ctx.from.username === username ? 'тобою' : 'цією людиною'
      } поки що немає в цій базі. Сподіваємося, що це зміниться в майбутньому!`,
    );
  }
};

module.exports.action = async function (ctx) {
  const currentCaption = ctx.update.callback_query.message.caption;
  const username = currentCaption.match(/@\S+\s/)[0].trim();

  const faces = PhotoStorage.getFacesByTelegram(username);
  const randomFace = faces[Math.floor(Math.random() * faces.length)];
  const photo = PhotoStorage.getPhotoById(randomFace.photoId);
  const caption = createCaption(username, photo);

  if (currentCaption === caption && faces.length > 1) {
    return module.exports.action(ctx);
  }

  await ctx.editMessageMedia({
    type: 'photo',
    media: {
      url: photo.urlLarge,
    },
  });

  await ctx.editMessageCaption(
    caption,
    Extra.markup((m) =>
      m.inlineKeyboard([m.callbackButton('Наступне фото ➡️', 'next_photo')]),
    ).HTML(),
  );
};
