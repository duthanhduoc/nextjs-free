import { AuthError, EntityError, ForbiddenError, StatusError, isPrismaClientKnownRequestError } from '@/utils/errors'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { FastifyError } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import { ZodError } from 'zod'

type ZodFastifyError = FastifyError & ZodError

const isZodFastifyError = (error: any): error is ZodFastifyError => {
  if (error instanceof ZodError) {
    return true
  }
  return false
}

const isEntityError = (error: any): error is EntityError => {
  if (error instanceof EntityError) {
    return true
  }
  return false
}

const isAuthError = (error: any): error is AuthError => {
  if (error instanceof AuthError) {
    return true
  }
  return false
}

const isForbiddenError = (error: any): error is ForbiddenError => {
  if (error instanceof ForbiddenError) {
    return true
  }
  return false
}

const isStatusError = (error: any): error is StatusError => {
  if (error instanceof StatusError) {
    return true
  }
  return false
}

export const errorHandlerPlugin = fastifyPlugin(async (fastify) => {
  fastify.setErrorHandler(function (
    error: EntityError | AuthError | ForbiddenError | FastifyError | ZodFastifyError | PrismaClientKnownRequestError,
    request,
    reply
  ) {
    if (isEntityError(error)) {
      return reply.status(error.status).send({
        message: 'Lỗi xảy ra khi xác thực dữ liệu...',
        errors: error.fields,
        statusCode: error.status
      })
    } else if (isForbiddenError(error)) {
      return reply.status(error.status).send({
        message: error.message,
        statusCode: error.status
      })
    } else if (isAuthError(error)) {
      return reply
        .setCookie('session_token', '', {
          path: '/',
          httpOnly: true,
          sameSite: 'none',
          secure: true
        })
        .status(error.status)
        .send({
          message: error.message,
          statusCode: error.status
        })
    } else if (isStatusError(error)) {
      return reply.status(error.status).send({
        message: error.message,
        statusCode: error.status
      })
    } else if (isZodFastifyError(error)) {
      const { issues, validationContext } = error
      const errors = issues.map((issue) => {
        return {
          ...issue,
          field: issue.path.join('.')
        }
      })
      const statusCode = 422
      return reply.status(statusCode).send({
        // validationContext will be 'body' or 'params' or 'headers' or 'query'
        message: `A validation error occurred when validating the ${validationContext}...`,
        errors,
        code: error.code,
        statusCode
      })
    } else if (isPrismaClientKnownRequestError(error) && error.code === 'P2025') {
      const statusCode = 404
      return reply.status(statusCode).send({
        message: 'Không tìm thấy dữ liệu!',
        statusCode: statusCode
      })
    } else {
      const statusCode = (error as any).statusCode || 400
      return reply.status(statusCode).send({
        message: error.message,
        error,
        statusCode
      })
    }
  })
})
