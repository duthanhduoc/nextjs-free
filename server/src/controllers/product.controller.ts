import prisma from '@/database'
import { CreateProductBodyType, UpdateProductBodyType } from '@/schemaValidations/product.schema'

export const getProductList = () => {
  return prisma.product.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  })
}

export const getProductDetail = (id: number) => {
  return prisma.product.findUniqueOrThrow({
    where: {
      id
    }
  })
}

export const createProduct = (data: CreateProductBodyType) => {
  return prisma.product.create({
    data
  })
}

export const updateProduct = (id: number, data: UpdateProductBodyType) => {
  return prisma.product.update({
    where: {
      id
    },
    data
  })
}

export const deleteProduct = (id: number) => {
  return prisma.product.delete({
    where: {
      id
    }
  })
}
