import productApiRequest from '@/apiRequests/product'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

export default async function ProductListPage() {
  const { payload } = await productApiRequest.getList()
  const productList = payload.data
  return (
    <div className='space-y-3'>
      <h1>Product List</h1>
      <Link href={'/products/add'}>
        <Button variant={'secondary'}>Thêm sản phẩm</Button>
      </Link>
      <div className='space-y-5'>
        {productList.map((product) => (
          <div key={product.id} className='flex space-x-4'>
            <Image
              src={product.image}
              alt={product.name}
              width={180}
              height={180}
              className='w-32 h-32 object-cover'
            />
            <h3>{product.name}</h3>
            <div>{product.price}</div>
            <div className='flex space-x-2'>
              <Link href={`/products/${product.id}`}>
                <Button variant={'outline'}>Edit</Button>
              </Link>
              <Button variant={'destructive'}>Delete</Button>
            </div>
          </div>
        ))}
        L
      </div>
    </div>
  )
}
