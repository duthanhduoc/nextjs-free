import { decodeJwt } from '@/lib/utils'

type PayloadJWT = {
  iat: number
  exp: number
  tokenType: string
  userId: number
}

export async function POST(request: Request) {
  const res = await request.json()
  const sessionToken = res.sessionToken as string
  if (!sessionToken) {
    return Response.json(
      { message: 'Không nhận được session token' },
      {
        status: 400
      }
    )
  }
  const payload = decodeJwt<PayloadJWT>(sessionToken)
  return Response.json(res, {
    status: 200,
    headers: {
      'Set-Cookie': `sessionToken=${sessionToken}; Path=/; HttpOnly; Expires=${new Date(
        payload.exp * 1000
      ).toUTCString()}; SameSite=Lax; Secure`
    }
  })
}
