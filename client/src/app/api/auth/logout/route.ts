import authApiRequest from '@/apiRequests/auth'
import { HttpError } from '@/lib/http'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const cookieStore = cookies()
  const sessionToken = cookieStore.get('sessionToken')
  console.log('sessionToken', sessionToken)
  if (!sessionToken) {
    return Response.json(
      { message: 'Không nhận được session token' },
      {
        status: 400
      }
    )
  }
  try {
    const result = await authApiRequest.callLogoutFromNextJsServer(
      sessionToken.value
    )

    return Response.json(result.payload, {
      status: 200,
      headers: {
        // Remove the sessionToken cookie
        'Set-Cookie': `sessionToken=; Path=/; HttpOnly; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
      }
    })
  } catch (error) {
    console.log(error)
    if (error instanceof HttpError) {
      return Response.json(error.payload, {
        status: error.status
      })
    }
    return Response.json(
      { message: 'Lỗi không xác định' },
      {
        status: 400
      }
    )
  }
}
