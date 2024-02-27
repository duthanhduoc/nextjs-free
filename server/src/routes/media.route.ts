import { requireLoginedHook } from '@/hooks/auth.hooks'
import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import fastifyMultipart from '@fastify/multipart'
import { uploadImage } from '@/controllers/media.controller'

export default async function mediaRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.register(fastifyMultipart)
  fastify.addHook('preValidation', fastify.auth([requireLoginedHook]))

  fastify.post('/upload', {}, async (request, reply) => {
    const data = await request.file({
      limits: {
        fileSize: 1024 * 1024 * 10, // 10MB,
        fields: 1,
        files: 1
      }
    })
    if (!data) {
      throw new Error('Không tìm thấy file')
    }
    const url = await uploadImage(data)
    return reply.send({ message: 'Upload ảnh thành công', data: url })
  })
}
