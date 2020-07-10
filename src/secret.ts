import readline from "readline"
import { BotSecret } from "./bot"
import { readFileSync, writeFile} from "fs"

// const secretFilePath = "./.secret.json"
const secretFilePath = `${process.cwd()}/.secret.json`
export async function getSecret() {
  try {
    const secretString: any = readFileSync(secretFilePath)
    const secret = JSON.parse(secretString);
    if (isValidSecret(secret)) {
      return secret
    }
    throw new Error()
  } catch (ex) {
    console.log("Fel i .secret.json", ex)
    return await createAndGetSecret()
  }
}

async function createAndGetSecret() {
  const reader = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  const secret: BotSecret = {
    OAUTH_TOKEN: "",
    BOT_USERNAME: "",
    CHANNEL_NAME: "",
  }
  console.log("You can get the credentials from Twitch.")
  await new Promise((resolve) =>
    reader.question("What is your OAUTH_TOKEN? You can get one from https://twitchapps.com/tmi/ ", (OAUTH_TOKEN) => {
      secret.OAUTH_TOKEN = OAUTH_TOKEN
      return resolve()
    }),
  )

  await new Promise((resolve) =>
    reader.question("What is your BOT_USERNAME? ", (BOT_USERNAME) => {
      secret.BOT_USERNAME = BOT_USERNAME
      return resolve()
    }),
  )

  await new Promise((resolve) =>
    reader.question("What is your CHANNEL_NAME? ", (CHANNEL_NAME) => {
      secret.CHANNEL_NAME = CHANNEL_NAME
      reader.close()
      return resolve()
    }),
  )
  await saveSecretToFile(secret)
  return secret
}

async function saveSecretToFile(secret: BotSecret) {
  return new Promise((resolve) => {
    writeFile(secretFilePath, JSON.stringify(secret, null, 2), console.log)
    resolve()
  })
}

export function isValidSecret(secret: BotSecret): boolean {
  console.log("secret", secret)
  if (!secret) {
    console.error("Missing secret")
    return false
  }
  if (!secret.OAUTH_TOKEN) {
    console.error("Missing OAUTH_TOKEN")
    return false
  }
  if (!secret.CHANNEL_NAME) {
    console.error("Missing CHANNEL_NAME")
    return false
  }
  if (!secret.BOT_USERNAME) {
    console.error("Missing BOT_USERNAME")
    return false
  }
  return true
}
