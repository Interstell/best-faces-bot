const PhotoStorage = require('../PhotoStorage');

module.exports = async function (ctx, next) {
  if (PhotoStorage.hasAccessToPhotos(ctx.from.username)) {
    await next();
  } else {
    return ctx.reply(
      `🤐 Вибач, але цей бот призначений виключно для мемберів BEST Kyiv.\n🤔 Сталася помилка? Напиши IT-Coordinator'у.`,
    );
  }
};
