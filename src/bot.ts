import { Client } from "tmi.js"
import { speak } from "say"
import { isValidSecret } from "./secret"

export interface BotSecret {
  OAUTH_TOKEN: string
  BOT_USERNAME: string
  CHANNEL_NAME: string
}

export function createBot(secret: BotSecret) {
  if (!isValidSecret(secret)) {
    throw new Error("Couldn't connect, missing secret.")
  }

  const ttsBot: Client = Client({
    options: { debug: true },
    identity: {
      username: secret.BOT_USERNAME,
      password: secret.OAUTH_TOKEN,
    },
    connection: {
      reconnect: true,
      secure: true,
    },
    channels: [`#${secret.CHANNEL_NAME}`],
  })

  ttsBot.on("message", (channel, tags, message, self) => {
    if (self) return

    const speakSpeed = 0.8
    speak(`${tags.username} says ${message}`, "Alex", speakSpeed)
  })

  ttsBot.on("connected", (addr, port) => {
    console.log(`* Connected to ${addr}:${port}`)
  })


  return ttsBot
}
