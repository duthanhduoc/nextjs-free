import envConfig from '@/config'
import { PrismaErrorCode } from '@/constants/error-reference'
import prisma from '@/database'
import { LoginBodyType, RegisterBodyType } from '@/schemaValidations/auth.schema'
import { comparePassword, hashPassword } from '@/utils/crypto'
import { EntityError, isPrismaClientKnownRequestError } from '@/utils/errors'
import { signSessionToken } from '@/utils/jwt'
import { addMilliseconds } from 'date-fns'
import ms from 'ms'

export const registerController = async (body: RegisterBodyType) => {
  try {
    const hashedPassword = await hashPassword(body.password)
    const account = await prisma.account.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPassword
      }
    })

    const sessionToken = signSessionToken({
      userId: account.id
    })
    const expiresAt = addMilliseconds(new Date(), ms(envConfig.SESSION_TOKEN_EXPIRES_IN))
    const session = await prisma.session.create({
      data: {
        accountId: account.id,
        token: sessionToken,
        expiresAt
      }
    })
    return {
      account,
      session
    }
  } catch (error: any) {
    if (isPrismaClientKnownRequestError(error)) {
      if (error.code === PrismaErrorCode.UniqueConstraintViolation) {
        throw new EntityError([{ field: 'email', message: 'Email đã tồn tại' }])
      }
    }
    throw error
  }
}
export const logoutController = async (sessionToken: string) => {
  await prisma.session.delete({
    where: {
      token: sessionToken
    }
  })
  return 'Đăng xuất thành công'
}

export const loginController = async (body: LoginBodyType) => {
  const account = await prisma.account.findUnique({
    where: {
      email: body.email
    }
  })
  if (!account) {
    throw new EntityError([{ field: 'email', message: 'Email không tồn tại' }])
  }
  const isPasswordMatch = await comparePassword(body.password, account.password)
  if (!isPasswordMatch) {
    throw new EntityError([{ field: 'password', message: 'Email hoặc mật khẩu không đúng' }])
  }
  const sessionToken = signSessionToken({
    userId: account.id
  })
  const expiresAt = addMilliseconds(new Date(), ms(envConfig.SESSION_TOKEN_EXPIRES_IN))

  const session = await prisma.session.create({
    data: {
      accountId: account.id,
      token: sessionToken,
      expiresAt
    }
  })
  return {
    account,
    session
  }
}
