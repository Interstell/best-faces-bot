const Extra = require('telegraf/extra');
const moment = require('moment');

const PhotoStorage = require('../PhotoStorage');

function createCaption(username, photo) {
  const date = moment(photo.dateTaken).format('DD.MM.YYYY HH:mm');
  // creating nice formatting of output
  const caption = [
    `👤 @${username.replace(/@/, '')}`,
    `📸 <a href="${photo.flickrUrl}">${photo.albumName}</a>`,
    `📅 ${date}`,
  ];

  return caption.join('\n');
}

// handler for implicit /me command or member nickname
module.exports.command = async function (ctx, username) {
  // extracting the array of photos of this user
  const faces = PhotoStorage.getFacesByTelegram(username);

  // if there are any faces present in the dataset
  if (faces.length > 0) {
    // selecting random face
    const randomFace = faces[Math.floor(Math.random() * faces.length)];
    // selecting the photo where this random face is present
    const photo = PhotoStorage.getPhotoById(randomFace.photoId);
    // generating nice caption for the photo
    const caption = createCaption(username, photo);

    // replying with photo and caption
    // example: https://github.com/telegraf/telegraf/blob/master/docs/examples/media-bot.js
    await ctx.replyWithPhoto(
      { url: photo.urlLarge },
      Extra.markup((m) =>
        // adding "Next photo ➡️" button under the photo
        m.inlineKeyboard([m.callbackButton('Наступне фото ➡️', 'next_photo')]),
      )
        .caption(caption) // adding caption
        .HTML(), // making <a href="..."> links in caption work,
    );
  } else {
    await ctx.replyWithMarkdown(
      `😢 На жаль, фото з ${
        ctx.from.username === username ? 'тобою' : 'цією людиною'
      } поки що немає в цій базі. Сподіваємося, що це зміниться в майбутньому!`,
    );
  }
};

// handler for the "Next photo ➡️" button
module.exports.action = async function (ctx) {
  // from the caption of the message under which the button was clicked
  const currentCaption = ctx.update.callback_query.message.caption;
  // we extract the Telegram username of the person on this photo
  const username = currentCaption.match(/@\S+\s/)[0].trim();

  // just like in previous handler, getting new random photo of the same user
  const faces = PhotoStorage.getFacesByTelegram(username);
  const randomFace = faces[Math.floor(Math.random() * faces.length)];
  const photo = PhotoStorage.getPhotoById(randomFace.photoId);
  const caption = createCaption(username, photo);

  // avoiding showing the same photo again
  // as it's forbidden by Telegram Bot API
  if (currentCaption === caption && faces.length > 1) {
    return module.exports.action(ctx);
  }

  // instead of sending new message, we edit the existing photo
  await ctx.editMessageMedia({
    type: 'photo',
    media: { url: photo.urlLarge },
  });

  // and changing the caption under this message
  await ctx.editMessageCaption(
    caption,
    Extra.markup((m) =>
      m.inlineKeyboard([m.callbackButton('Наступне фото ➡️', 'next_photo')]),
    ).HTML(),
  );
};
