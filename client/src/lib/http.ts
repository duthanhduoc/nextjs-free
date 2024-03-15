import envConfig from '@/config'
import { LoginResType } from '@/schemaValidations/auth.schema'

class HttpError extends Error {
  status: number
  payload: any
  constructor({ status, payload }: { status: number; payload: any }) {
    super('Http Error')
    this.status = status
    this.payload = payload
  }
}

type CustomOptions = Omit<RequestInit, 'body' | 'method'> & {
  body?: any
  baseUrl?: string
}
class SessionToken {
  private token = ''
  get value() {
    return this.token
  }
  set value(token: string) {
    if (typeof window === 'undefined') {
      throw new Error('This method is only supported in the client side')
    }
    this.token = token
  }
}
export const clientSessionToken = new SessionToken()

const request = async <Response>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  options?: CustomOptions | undefined
) => {
  const body = options?.body ? JSON.stringify(options.body) : undefined
  const baseHeaders = {
    'Content-Type': 'application/json',
    Authorization: clientSessionToken.value
      ? `Bearer ${clientSessionToken.value}`
      : ''
  }
  // Nếu không truyền baseUrl (hoặc baseUrl = undefined) thì sẽ lấy giá trị mặc định từ envConfig
  // Nếu truyền baseUrl thì sẽ lấy giá trị truyền vào, truyền vào '' thì gọi đến Next.js Server, còn truyền vào endpoint thì gọi đến server khác

  const baseUrl =
    options?.baseUrl === undefined
      ? envConfig.NEXT_PUBLIC_API_ENDPOINT
      : options.baseUrl
  const fulllUrl = url.startsWith('/')
    ? `${baseUrl}${url}`
    : `${baseUrl}/${url}`
  const res = await fetch(fulllUrl, {
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers
    },
    body,
    method
  })
  const payload: Response = await res.json()
  const data = {
    status: res.status,
    payload
  }
  if (!res.ok) {
    throw new HttpError(data)
  }
  if (url === 'auth/login' || url === 'auth/register') {
    clientSessionToken.value = (payload as LoginResType).data.token
  } else if (url === 'auth/logout') {
    clientSessionToken.value = ''
  }
  return data
}

const http = {
  get<Response>(
    url: string,
    options?: Omit<CustomOptions, 'body'> | undefined
  ) {
    return request<Response>('GET', url, options)
  },
  post<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, 'body'> | undefined
  ) {
    return request<Response>('POST', url, { ...options, body })
  },
  put<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, 'body'> | undefined
  ) {
    return request<Response>('PUT', url, { ...options, body })
  },
  delete<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, 'body'> | undefined
  ) {
    return request<Response>('DELETE', url, { ...options, body })
  }
}

export default http
