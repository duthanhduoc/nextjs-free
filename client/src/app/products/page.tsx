import productApiRequest from '@/apiRequests/product'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default async function ProductListPage() {
  const { payload } = await productApiRequest.getList()
  const productList = payload.data
  return (
    <div>
      <h1>Product List</h1>
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
              <Button variant={'outline'}>Edit</Button>
              <Button variant={'destructive'}>Delete</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
