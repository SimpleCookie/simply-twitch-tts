import { Client } from "tmi.js"
import speaker from "async-sayjs"
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
      const wordLimit = 18
      const characterLimit = 90
      if (self) return
      if (message.length > characterLimit || message.split(' ').length > wordLimit) {
        console.log(`Skipped ${tags.username}'s msg: ${message}`)
        return
      }
      speaker.speak(`${tags.username} says ${message}`)
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
