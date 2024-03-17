import envConfig from '@/config'
import {
  loginController,
  logoutController,
  refreshSessionController,
  registerController
} from '@/controllers/auth.controller'
import { requireLoginedHook } from '@/hooks/auth.hooks'
import {
  LoginBody,
  LoginBodyType,
  LoginRes,
  LoginResType,
  RefreshSessionBody,
  RefreshSessionBodyType,
  RefreshSessionRes,
  RefreshSessionResType,
  RegisterBody,
  RegisterBodyType,
  RegisterRes,
  RegisterResType
} from '@/schemaValidations/auth.schema'
import { MessageRes, MessageResType } from '@/schemaValidations/common.schema'
import { FastifyInstance, FastifyPluginOptions } from 'fastify'

export default async function authRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.post<{
    Reply: RegisterResType
    Body: RegisterBodyType
  }>(
    '/register',
    {
      schema: {
        response: {
          200: RegisterRes
        },
        body: RegisterBody
      }
    },
    async (request, reply) => {
      const { body } = request
      const { session, account } = await registerController(body)
      if (envConfig.COOKIE_MODE) {
        reply
          .setCookie('sessionToken', session.token, {
            path: '/',
            httpOnly: true,
            secure: true,
            expires: session.expiresAt,
            sameSite: 'none',
            domain: envConfig.DOMAIN
          })
          .send({
            message: 'Đăng ký thành công',
            data: {
              token: session.token,
              account
            }
          })
      } else {
        reply.send({
          message: 'Đăng ký thành công',
          data: {
            token: session.token,
            account
          }
        })
      }
    }
  )
  fastify.post<{ Reply: MessageResType }>(
    '/logout',
    {
      schema: {
        response: {
          200: MessageRes
        }
      },
      preValidation: fastify.auth([requireLoginedHook])
    },
    async (request, reply) => {
      const sessionToken = envConfig.COOKIE_MODE
        ? request.cookies.sessionToken
        : request.headers.authorization?.split(' ')[1]
      const message = await logoutController(sessionToken as string)
      if (envConfig.COOKIE_MODE) {
        reply
          .clearCookie('sessionToken', {
            path: '/',
            httpOnly: true,
            sameSite: 'none',
            secure: true
          })
          .send({
            message
          })
      } else {
        reply.send({
          message
        })
      }
    }
  )
  fastify.post<{ Reply: LoginResType; Body: LoginBodyType }>(
    '/login',
    {
      schema: {
        response: {
          200: LoginRes
        },
        body: LoginBody
      }
    },
    async (request, reply) => {
      const { body } = request
      const { session, account } = await loginController(body)
      if (envConfig.COOKIE_MODE) {
        reply
          .setCookie('sessionToken', session.token, {
            path: '/',
            httpOnly: true,
            secure: true,
            expires: session.expiresAt,
            sameSite: 'none',
            domain: envConfig.DOMAIN
          })
          .send({
            message: 'Đăng nhập thành công',
            data: {
              token: session.token,
              account
            }
          })
      } else {
        reply.send({
          message: 'Đăng nhập thành công',
          data: {
            token: session.token,
            account
          }
        })
      }
    }
  )

  fastify.post<{ Reply: RefreshSessionResType; Body: RefreshSessionBodyType }>(
    '/refresh-session',
    {
      schema: {
        response: {
          200: RefreshSessionRes
        },
        body: RefreshSessionBody
      },
      preValidation: fastify.auth([requireLoginedHook])
    },
    async (request, reply) => {
      const sessionToken = envConfig.COOKIE_MODE
        ? request.cookies.sessionToken
        : request.headers.authorization?.split(' ')[1]
      const session = await refreshSessionController(sessionToken as string)
      if (envConfig.COOKIE_MODE) {
        reply
          .setCookie('sessionToken', session.token, {
            path: '/',
            httpOnly: true,
            secure: true,
            expires: session.expiresAt,
            sameSite: 'none',
            domain: envConfig.DOMAIN
          })
          .send({
            message: 'Refresh session thành công',
            data: {
              token: session.token,
              account: request.account!
            }
          })
      } else {
        reply.send({
          message: 'Refresh session thành công',
          data: {
            token: session.token,
            account: request.account!
          }
        })
      }
    }
  )
}
