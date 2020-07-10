
import {createBot} from "./bot"
import { getSecret } from "./secret"

async function run() {
  const secret = await getSecret()
  try {
    const bot = createBot(secret)
    bot.connect();
  } catch (error) {
    console.error(error)
  }
}

run()
