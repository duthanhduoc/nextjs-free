import fs from 'fs'

export const randomId = () => crypto.randomUUID().replace(/-/g, '')
export const createFolder = (folderPath: string) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true })
  }
}
