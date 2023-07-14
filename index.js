require('dotenv').config();

const { App } = require('@slack/bolt');

const app = new App({
  socketMode: true,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
});

const welcomeChannelId = process.env.SLACK_WELCOME_CHANNEL_ID;

// When a user joins the team, send a message in a predefined channel asking them to introduce themselves
app.event('team_join', async ({ event, client, logger }) => {
  let { user } = event;


  // Ignore @deactivateduser's
  if (user.deleted) {
    return;
  }

  try {
    // Call chat.postMessage with the built-in client
    const result = await client.chat.postMessage({
      channel: welcomeChannelId,
      text: `Welcome to the team, <@${user.id}>! 🎉 You can introduce yourself in this channel.`
    });
    logger.info(result);
  }
  catch (error) {
    logger.error(error);
  }
});

(async () => {
  // Start the app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Friendly Bot is running!');
})();