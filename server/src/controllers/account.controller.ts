import prisma from '@/database'
import { UpdateMeBodyType } from '@/schemaValidations/account.schema'

export const updateMeController = async (accountId: number, body: UpdateMeBodyType) => {
  const account = prisma.account.update({
    where: {
      id: accountId
    },
    data: {
      name: body.name
    }
  })
  return account
}
