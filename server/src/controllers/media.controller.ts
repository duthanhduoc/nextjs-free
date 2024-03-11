import { randomId } from '@/utils/helpers'
import { MultipartFile } from '@fastify/multipart'
import path from 'path'
import fs from 'fs'
import util from 'util'
import { pipeline } from 'stream'
import envConfig, { API_URL } from '@/config'
const pump = util.promisify(pipeline)

export const uploadImage = async (data: MultipartFile) => {
  const uniqueId = randomId()
  const ext = path.extname(data.filename)
  const id = uniqueId + ext
  const filepath = path.resolve(envConfig.UPLOAD_FOLDER, id)
  await pump(data.file, fs.createWriteStream(filepath))
  if (data.file.truncated) {
    // Xóa file nếu file bị trucated
    await fs.unlinkSync(filepath)
    throw new Error('Giới hạn file là 10MB')
  }
  const url = `${API_URL}` + '/static/' + id
  return url
}
