const { Telegraf } = require('telegraf');

require('dotenv-safe').config();

const handlers = require('./handlers');

const bot = new Telegraf(process.env.BOT_TOKEN);

async function setHandlers() {
  bot.start(handlers.start);
  bot.help(handlers.help);

  bot.catch(async (err, ctx) => {
    console.error(
      `An error from @${ctx.from.username} (query: ${ctx.message.text})`,
      err,
    );
    await ctx.reply(
      "Упс, щось пішло не так, я зламався 😭. Будь ласка, звернись до IT Coordinator'а.",
    );
  });
}

setHandlers()
  .then(() => bot.launch())
  .catch(console.error);
