import { createBot } from "./bot"
import { getSecret } from "./secret"
import axios from "axios"

async function run() {
  const secret = await getSecret()
  try {
    const bot = createBot(secret)
    bot
      .connect()
      .then(() => console.log("connected."))
      .catch(console.log)
  } catch (error) {
    console.error(error)
  }
}

run()
