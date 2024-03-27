import productApiRequest from '@/apiRequests/product'

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
      {product && <div>{product.name}</div>}
    </div>
  )
}
