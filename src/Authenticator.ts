import axios from "axios"
import { question } from "./utilities"
import { readFileSync, writeFile } from "fs"

export class Authenticator {
  private clientId: string
  private clientSecret: string
  private tokenUrl = "https://id.twitch.tv/oauth2/token"
  private clientInfoPath = `${process.cwd()}/.client-info.json`
  private accessToken?: string

  async setup() {
    try {
      await this.readClientInfoFile()
    } catch (error) {
      console.log(error)
      await this.requestClientInfo()
    }
    return this.fetchToken()
  }

  async fetchToken(): Promise<AuthResponse> {
    const { status, data } = await axios.post(
      this.tokenUrl,
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
    console.log("response", status)
    this.accessToken = data.access_token
    return data
  }

  async readClientInfoFile() {
    const fileData: any = readFileSync(this.clientInfoPath)
    const { clientId, clientSecret } = JSON.parse(fileData)
    this.clientId = clientId
    this.clientSecret = clientSecret

    if (!clientId || !clientSecret) {
      throw new Error(`Fel i ${this.clientInfoPath}`)
    }
  }

  async requestClientInfo() {
    console.log("You can get the credentials from Twitch.")
    this.clientId = await question("Enter client id: ")
    this.clientSecret = await question("Enter client secret: ")

    this.saveClientInfoToFile(this.clientId, this.clientSecret)
  }

  getToken(): string {
    return this.accessToken
  }

  saveClientInfoToFile(clientId, clientSecret) {
    writeFile(
      this.clientInfoPath,
      JSON.stringify({ clientId, clientSecret }, null, 2),
      console.log,
    )
  }
}

export interface AuthResponse {
  access_token: string
  expires_in: number
  scope: string[]
  token_type: string
}
export interface ClientInfo {
  clientId: string
  clientSecret: string
}
