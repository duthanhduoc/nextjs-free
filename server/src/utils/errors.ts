import { Prisma } from '@prisma/client'

export class EntityError extends Error {
  fields: { message: string; field: string }[]
  status: number = 422
  constructor(fields: { message: string; field: string }[]) {
    super('Lỗi xác thực dữ liệu')
    this.fields = fields
  }
}
export class AuthError extends Error {
  status: number = 401
  constructor(message: string) {
    super(message)
  }
}

export class ForbiddenError extends Error {
  status: number = 403
  constructor(message: string) {
    super(message)
  }
}

export class StatusError extends Error {
  status: number
  constructor({ message, status }: { message: string; status: number }) {
    super(message)
    this.status = status
  }
}

export function isPrismaClientKnownRequestError(error: unknown): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError
}
