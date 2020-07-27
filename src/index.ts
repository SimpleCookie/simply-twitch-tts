import { Authenticator } from "./Authenticator"
import { Bot } from "./bot"

async function run() {
  const authenticator = new Authenticator()
  await authenticator.initialise()
  const userToken = await authenticator.getUserAccess()

  try {
    const bot = new Bot()
    const botInstance = await bot.createBot(userToken)

    botInstance
      .connect()
      .then(() => console.log("connected."))
      .catch(console.log)
  } catch (error) {
    console.error(error)
  }
}

run()
