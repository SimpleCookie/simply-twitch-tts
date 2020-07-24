import { createBot } from "./bot"
import { Authenticator } from "./Authenticator"

async function run() {
  const authenticator = new Authenticator()
  const sessionInfo = await authenticator.setup()
  const botSecret = {
    OAUTH_TOKEN: `OAUTH:${sessionInfo.access_token}`,
    BOT_USERNAME: "CookieBot",
    CHANNEL_NAME: "#SimpleCookie",
  }

  try {
    const bot = createBot(botSecret)

    bot
      .connect()
      .then(() => console.log("connected."))
      .catch(console.log)
  } catch (error) {
    console.error(error)
  }
}

run()
