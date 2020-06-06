const { Telegraf } = require('telegraf');

require('dotenv-safe').config();

const handlers = require('./handlers');

const bot = new Telegraf(process.env.BOT_TOKEN);

async function setHandlers() {
  bot.start(handlers.start);
  bot.help(handlers.help);

  bot.command('me', (ctx) => handlers.photo.command(ctx, ctx.from.username));
  bot.hears(/^@/, (ctx) => handlers.photo.command(ctx, ctx.match.input));

  bot.action('next_photo', handlers.photo.action);

  bot.catch(async (err, ctx) => {
    console.error(`An error from @${ctx.from.username}`, err);
    await ctx.reply(
      "Упс, щось пішло не так, я зламався 😭. Будь ласка, звернись до IT Coordinator'а.",
    );
  });
}

setHandlers()
  .then(() => bot.launch())
  .catch(console.error);
