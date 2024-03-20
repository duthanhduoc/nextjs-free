'use client'

import authApiRequest from '@/apiRequests/auth'
import { clientSessionToken } from '@/lib/http'
import { useEffect } from 'react'
import { differenceInHours } from 'date-fns'

export default function SlideSession() {
  useEffect(() => {
    const interval = setInterval(async () => {
      const now = new Date()
      const expiresAt = new Date(clientSessionToken.expiresAt)
      if (differenceInHours(expiresAt, now) < 1) {
        const res =
          await authApiRequest.slideSessionFromNextClientToNextServer()
        clientSessionToken.expiresAt = res.payload.data.expiresAt
      }
    }, 1000 * 60 * 30)
    return () => clearInterval(interval)
  }, [])
  return null
}
