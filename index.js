require('dotenv').config();

const { App } = require('@slack/bolt');

const app = new App({
  socketMode: true,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
});

const welcomeChannelId = process.env.SLACK_WELCOME_CHANNEL_ID;
const welcomeGuideLink = process.env.SLACK_WELCOME_GUIDE_LINK;

app.event('team_join', async ({ event, client }) => {
  let { user } = event;
  
  await sayHello({ event, client, user });
  await sendOnboarding({ client, user });
});

// app.event('member_joined_channel', async ({ event, client }) => {
//   let { user: userId } = event;
//   let { user } = await client.users.info({ user: userId });

//   await sayHello({ event, client, user });
//   await sendOnboarding({ client, user });
// });

async function sendOnboarding({ client, user }) {
  let { channel } = await client.conversations.open({
    users: user.id
  });

  const { message } = await client.chat.postMessage({
    channel: channel.id,
    text:
`Welcome to Market Social! 🎉 Market Social is a social community for young adults in their 20s and 30s living in C’ville. We help people in a transient city form acquaintances that lead to meaningful relationships.

First up, please:

- *Read the <${welcomeGuideLink}|Welcome Guide>* — it’s got all the important things 😎
- *Say hi in the <#${welcomeChannelId}> channel* (I’ve already started a thread for you 🤗)`
  });
  console.log(message);
}

async function sayHello({ event, client, user }) {
  console.log(event);

  // Ignore @deactivateduser's
  if (user.deleted) {
    return;
  }

  const { message } = await client.chat.postMessage({
    channel: welcomeChannelId,
    text: `Everyone welcome <@${user.id}> to Market Social! 🎉 Say hello in the thread below: 🧵👇`
  });
  console.log(message);

  const { message: reply } = await client.chat.postMessage({
    channel: welcomeChannelId,
    thread_ts: message.ts,
    text: `👋 _(just kicking off introductions)_`
  });
  console.log(reply);
};

(async () => {
  // Start the app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Friendly Bot is running!');
})();