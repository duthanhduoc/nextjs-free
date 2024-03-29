// Import the framework and instantiate it
import envConfig, { API_URL } from '@/config'
import { errorHandlerPlugin } from '@/plugins/errorHandler.plugins'
import validatorCompilerPlugin from '@/plugins/validatorCompiler.plugins'
import accountRoutes from '@/routes/account.route'
import authRoutes from '@/routes/auth.route'
import fastifyAuth from '@fastify/auth'
import fastifyCookie from '@fastify/cookie'
import fastifyHelmet from '@fastify/helmet'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import path from 'path'
import { createFolder } from '@/utils/helpers'
import mediaRoutes from '@/routes/media.route'
import staticRoutes from '@/routes/static.route'
import productRoutes from '@/routes/product.route'
import testRoutes from '@/routes/test.route'

const fastify = Fastify({
  logger: true
})

// Run the server!
const start = async () => {
  try {
    createFolder(path.resolve(envConfig.UPLOAD_FOLDER))
    const whitelist = ['*']
    fastify.register(cors, {
      origin: whitelist, // Cho phép tất cả các domain gọi API
      credentials: true // Cho phép trình duyệt gửi cookie đến server
    })

    fastify.register(fastifyAuth, {
      defaultRelation: 'and'
    })
    fastify.register(fastifyHelmet, {
      crossOriginResourcePolicy: {
        policy: 'cross-origin'
      }
    })
    fastify.register(fastifyCookie)
    fastify.register(validatorCompilerPlugin)
    fastify.register(errorHandlerPlugin)
    fastify.register(authRoutes, {
      prefix: '/auth'
    })
    fastify.register(accountRoutes, {
      prefix: '/account'
    })
    fastify.register(mediaRoutes, {
      prefix: '/media'
    })
    fastify.register(staticRoutes, {
      prefix: '/static'
    })
    fastify.register(productRoutes, {
      prefix: '/products'
    })
    fastify.register(testRoutes, {
      prefix: '/test'
    })
    await fastify.listen({
      port: envConfig.PORT
    })
    console.log(`Server đang chạy: ${API_URL}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
