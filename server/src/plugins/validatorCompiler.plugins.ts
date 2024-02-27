import fastifyPlugin from 'fastify-plugin'
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod'

const validatorCompilerPlugin = fastifyPlugin(async (fastify) => {
  fastify.setValidatorCompiler(validatorCompiler)
  fastify.setSerializerCompiler(serializerCompiler)
})

export default validatorCompilerPlugin
