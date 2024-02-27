import envConfig from '@/config'
import { TokenType } from '@/constants/type'
import { TokenPayload } from '@/types/jwt.types'
import { SignerOptions, createSigner, createVerifier } from 'fast-jwt'
import ms from 'ms'

export const signSessionToken = (payload: Pick<TokenPayload, 'userId'>, options?: SignerOptions) => {
  const signSync = createSigner({
    key: envConfig.SESSION_TOKEN_SECRET,
    algorithm: 'HS256',
    expiresIn: ms(envConfig.SESSION_TOKEN_EXPIRES_IN),
    ...options
  })
  return signSync({ ...payload, tokenType: TokenType.SessionToken })
}

export const verifySessionToken = (token: string) => {
  const verifySync = createVerifier({
    key: envConfig.SESSION_TOKEN_SECRET
  })
  return verifySync(token) as TokenPayload
}
