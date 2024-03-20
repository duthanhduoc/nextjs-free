'use client'

import { clientSessionToken } from '@/lib/http'
import { useEffect } from 'react'
import { differenceInHours } from 'date-fns'
import authApiRequest from '@/apiRequests/auth'

export default function SlidingSession() {
  useEffect(() => {
    const interval = setInterval(async () => {
      const now = new Date()
      const expiresAt = new Date(clientSessionToken.expiresAt)
      if (differenceInHours(expiresAt, now) < 1) {
        const res =
          await authApiRequest.slideSessionFromNextClientToNextServer()
        clientSessionToken.expiresAt = res.payload.data.expiresAt
      }
    }, 1000 * 60 * 10)
    return () => clearInterval(interval)
  }, [])
  // return null
  return (
    <button
      onClick={async () => {
        const res =
          await authApiRequest.slideSessionFromNextClientToNextServer()
        clientSessionToken.expiresAt = res.payload.data.expiresAt
      }}
    >
      Sliding Session
    </button>
  )
}
