import readline from "readline"
import { readFileSync, writeFile } from "fs"

const reader = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})
const clientInfoPath = `${process.cwd()}/.secrets.json`

export async function question(message: string): Promise<string> {
  return new Promise((resolve) => {
    reader.question(message, (response) => {
      return resolve(response)
    })
  })
}

export async function saveToFile(data: Record<string, any>) {
  const fileData = await readFromFile()
  try {
    writeFile(
      clientInfoPath,
      JSON.stringify({ ...fileData, ...data }, null, 2),
      console.log
    )
  } catch (error) {
    console.log(error)
  }
}

export async function readFromFile() {
  try {
    const raw: any = readFileSync(clientInfoPath)
    return JSON.parse(raw)
  } catch (error) {
    return {}
  }
}
