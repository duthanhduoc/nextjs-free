import productApiRequest from '@/apiRequests/product'
import ProductAddForm from '@/app/products/_components/product-add-form'
import { Metadata, ResolvingMetadata } from 'next'
import { cache } from 'react'

const getDetail = cache(productApiRequest.getDetail)

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(props: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const params = await props.params;
  const { payload } = await getDetail(Number(params.id))
  const product = payload.data
  return {
    title: 'Edit sản phẩm: ' + product.name,
    description: product.description
  }
}

export default async function ProductEdit(props: Props) {
  const params = await props.params;
  let product = null
  try {
    const { payload } = await getDetail(Number(params.id))
    product = payload.data
  } catch (error) {}

  return (
    <div>
      {!product && <div>Không tìm thấy sản phẩm</div>}
      {product && <ProductAddForm product={product} />}
    </div>
  )
}
