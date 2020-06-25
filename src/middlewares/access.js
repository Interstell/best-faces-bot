const PhotoStorage = require('../PhotoStorage');

module.exports = async function (ctx, next) {
  // if user nickname is present in the best-flickr-members.json file
  if (PhotoStorage.hasAccessToPhotos(ctx.from.username)) {
    // proceed to handlers
    await next();
  } else {
    // otherwise - send "access denied" message
    return ctx.reply(
      `🤐 Вибач, але цей бот призначений виключно для мемберів BEST Kyiv.\n🤔 Сталася помилка? Напиши IT-Coordinator'у.`,
    );
  }
};
