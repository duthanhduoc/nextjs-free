import http from '@/lib/http'
import { MessageResType } from '@/schemaValidations/common.schema'
import {
  CreateProductBodyType,
  ProductListResType,
  ProductResType,
  UpdateProductBodyType
} from '@/schemaValidations/product.schema'

const productApiRequest = {
  getList: () => http.get<ProductListResType>('/products'),
  getDetail: (id: number) =>
    http.get<ProductResType>(`/products/${id}`, {
      cache: 'no-store'
    }),
  create: (body: CreateProductBodyType) =>
    http.post<ProductResType>('/products', body),
  update: (id: number, body: UpdateProductBodyType) =>
    http.put<ProductResType>(`/products/${id}`, body),
  uploadImage: (body: FormData) =>
    http.post<{
      message: string
      data: string
    }>('/media/upload', body),
  delete: (id: number) => http.delete<MessageResType>(`/products/${id}`)
}

export default productApiRequest
