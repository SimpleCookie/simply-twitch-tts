import { Client } from "tmi.js";
import { speak, getInstalledVoices } from "say";
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

console.log(getInstalledVoices(console.log))
function onMessageHandler(channel, tags, message, self) {
  if (self) return;

  speak(`${tags.username} says ${message}`, "Alex", 0.8);
}

function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}
