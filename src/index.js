const { Telegraf } = require('telegraf');

// loading .env file content
require('dotenv-safe').config();

const handlers = require('./handlers');
const middlewares = require('./middlewares');

const BOT_TOKEN = process.env.BOT_TOKEN || '';

// creating bot instance using BOT_TOKEN from .env file
const bot = new Telegraf(BOT_TOKEN);

async function setHandlers() {
  // middleware to restrict access for BEST members only
  bot.use(middlewares.access);

  // bot description on /start and /help
  bot.start(handlers.start);
  bot.help(handlers.help);

  // handler for /me command to show the photo of the user (sender)
  bot.command('me', (ctx) => handlers.photo.command(ctx, ctx.from.username));

  // handler for input starting with @ to show the photo of the BEST member with this nickname
  bot.hears(/^@/, (ctx) => handlers.photo.command(ctx, ctx.match.input));

  // handler for the "Next photo ➡️" button
  bot.action('next_photo', handlers.photo.action);

  // handler for any error that may occur
  bot.catch(async (err, ctx) => {
    console.error(`An error from @${ctx.from.username}`, err);
    await ctx.reply(
      "Упс, щось пішло не так, я зламався 😭. Будь ласка, звернись до IT Coordinator'а.",
    );
  });
}

// adding handlers to the `bot` instance and launching the bot
setHandlers()
  .then(() => bot.launch())
  .catch(console.error);
