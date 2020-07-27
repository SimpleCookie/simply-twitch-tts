import { Client } from "tmi.js"
import { speak } from "say"
import { question, saveToFile, readFromFile } from "./utilities"

export class Bot {
  username: string
  channel: string

  async createBot(oauthToken: string) {
    await this.getBotInfo()

    const ttsBot: Client = Client({
      options: { debug: true },
      identity: {
        username: this.username,
        password: oauthToken,
      },
      connection: {
        reconnect: true,
        secure: true,
      },
      channels: [`#${this.channel}`],
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

  async getBotInfo() {
    const { username, channel } = await readFromFile()
    this.username = username
    this.channel = channel

    if (!this.username || !this.channel) {
      this.username = await question("Enter bot username: ")
      this.channel = await question("Enter bot stream channel: ")
    }
    saveToFile({ channel: this.channel, username: this.username })
  }
}
