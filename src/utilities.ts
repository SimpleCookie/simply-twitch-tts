import readline from "readline"

const reader = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

export async function question(message: string): Promise<string> {
  return new Promise((resolve) => {
    reader.question(message, response => {
      return resolve(response)
    })
  })
}
