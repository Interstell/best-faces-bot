module.exports = async function (ctx) {
  const reply = [
    `Наразі доступні такі можливості:`,
    `- /me - фото із тобою`,
    `- @nickname (наприклад, @dykyjhutsul) - фото з цим мембером`,
    ``,
    `Нік можна швидко знайти тут: @BestKyivMembersBot`,
  ];
  await ctx.replyWithMarkdown(reply.join('\n'));
};
