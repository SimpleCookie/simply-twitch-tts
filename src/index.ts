import { Client } from "tmi.js";
import { speak } from "say";
import secret from "../.secret.json"

const client = Client({
  options: { debug: true },
  identity: {
    username: secret.BOT_USERNAME,
    password: secret.OAUTH_TOKEN,
  },
  connection: {
    reconnect: true,
    secure: true,
  },
  channels: [secret.CHANNEL_NAME],
});

client.on("message", onMessageHandler);
client.on("connected", onConnectedHandler);
client.connect();

const speakSpeed = 0.8

function onMessageHandler(channel, tags, message, self) {
  if (self) return;

  speak(`${tags.username} says ${message}`, "Alex", speakSpeed);
}

function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}
