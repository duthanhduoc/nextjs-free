import productApiRequest from '@/apiRequests/product'
import Image from 'next/image'
import { Metadata, ResolvingMetadata } from 'next'
import { cache } from 'react'
import envConfig from '@/config'
import { baseOpenGraph } from '@/app/shared-metadata'

const getDetail = cache(productApiRequest.getDetail)

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(props: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const params = await props.params;
  const { payload } = await getDetail(Number(params.id))
  const product = payload.data
  const url = envConfig.NEXT_PUBLIC_URL + '/products/' + product.id
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      ...baseOpenGraph,
      title: product.name,
      description: product.description,
      url,
      images: [
        {
          url: product.image
        }
      ]
    },
    alternates: {
      canonical: url
    }
  }
}

export default async function ProductDetail(props: Props) {
  const params = await props.params;
  let product = null
  try {
    const { payload } = await getDetail(Number(params.id))
    product = payload.data
  } catch (error) {}

  return (
    <div>
      {!product && <div>Không tìm thấy sản phẩm</div>}
      {product && (
        <div>
          <Image
            src={product.image}
            alt={product.name}
            width={180}
            height={180}
            className='w-32 h-32 object-cover'
          />

          <h3>{product.name}</h3>
          <div>{product.price}</div>
        </div>
      )}
    </div>
  )
}
