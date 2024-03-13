import envConfig from '@/config'
import prisma from '@/database'
import { AuthError } from '@/utils/errors'
import { FastifyRequest } from 'fastify'

export const requireLoginedHook = async (request: FastifyRequest) => {
  const sessionToken = envConfig.COOKIE_MODE
    ? request.cookies.sessionToken
    : request.headers.authorization?.split(' ')[1]

  if (!sessionToken) throw new AuthError('Không nhận được session token')
  const session_row = await prisma.session.findUnique({
    where: {
      token: sessionToken as string
    },
    include: {
      account: true
    }
  })
  if (!session_row) throw new AuthError('Session Token không tồn tại')
  request.account = session_row.account
}
