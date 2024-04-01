import productApiRequest from '@/apiRequests/product'
import ProductAddForm from '@/app/products/_components/product-add-form'

export default async function ProductEdit({
  params
}: {
  params: { id: string }
}) {
  let product = null
  try {
    const { payload } = await productApiRequest.getDetail(Number(params.id))
    product = payload.data
  } catch (error) {}

  return (
    <div>
      {!product && <div>Không tìm thấy sản phẩm</div>}
      {product && <ProductAddForm product={product} />}
    </div>
  )
}
