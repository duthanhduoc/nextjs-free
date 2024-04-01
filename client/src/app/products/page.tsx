import productApiRequest from '@/apiRequests/product'
import DeleteProduct from '@/app/products/_components/delete-product'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Danh sách sản phẩm',
  description: 'Danh sách sản phẩm của Productic, được tạo bởi Được dev'
}

export default async function ProductListPage() {
  const cookieStore = cookies()
  const sessionToken = cookieStore.get('sessionToken')
  const isAuthenticated = Boolean(sessionToken)
  const { payload } = await productApiRequest.getList()
  const productList = payload.data
  return (
    <div className='space-y-3'>
      <h1>Product List</h1>
      {isAuthenticated && (
        <Link href={'/products/add'}>
          <Button variant={'secondary'}>Thêm sản phẩm</Button>
        </Link>
      )}

      <div className='space-y-5'>
        {productList.map((product) => (
          <div key={product.id} className='flex space-x-4'>
            <Link href={`/products/${product.id}`}>
              <Image
                src={product.image}
                alt={product.name}
                width={180}
                height={180}
                className='w-32 h-32 object-cover'
              />
            </Link>

            <h3>{product.name}</h3>
            <div>{product.price}</div>
            {isAuthenticated && (
              <div className='flex space-x-2 items-start'>
                <Link href={`/products/${product.id}/edit`}>
                  <Button variant={'outline'}>Edit</Button>
                </Link>
                <DeleteProduct product={product} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
