import axios from "axios"
import { question, readFromFile, saveToFile } from "./utilities"

export class Authenticator {
  private clientId: string
  private clientSecret: string
  private appTokenUrl = "https://id.twitch.tv/oauth2/token"
  private userToken: string
  private appToken: string

  async initialise() {
    const { clientId, clientSecret, userToken } = await readFromFile()
    this.clientId = clientId
    this.clientSecret = clientSecret
    this.userToken = userToken
  }

  async fetchAppToken(): Promise<AuthResponse> {
    const { status, data } = await axios.post(
      this.appTokenUrl,
      {},
      {
        params: {
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: "client_credentials",
          scope: "chat:read",
        },
      },
    )
    console.log(`HTTP-status ${status}`)
    this.appToken = data.access_token
    return data
  }

  async getUserAccess(): Promise<string> {
    if (!this.userToken) await this.requestUserAccess()
    return this.userToken
  }

  async getAppAccess(): Promise<string> {
    if (!this.clientId || !this.clientSecret) await this.requestAppAccess()
    if (!this.appToken) await this.fetchAppToken()
    return this.userToken
  }

  async requestUserAccess() {
    console.log("You can get your OAUTH_TOKEN from https://twitchapps.com/tmi/")
    this.userToken = await question("Enter OAUTH_TOKEN: ")
    saveToFile({ userToken: this.userToken })
  }

  async requestAppAccess() {
    console.log("You can get the credentials from Twitch.")
    this.clientId = await question("Enter client id: ")
    this.clientSecret = await question("Enter client secret: ")
    saveToFile({ clientId: this.clientId, clientSecret: this.clientSecret })
  }
}

export interface AuthResponse {
  access_token: string
  expires_in: number
  scope: string[]
  token_type: string
}
