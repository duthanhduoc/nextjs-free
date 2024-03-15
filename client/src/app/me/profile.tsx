'use client'

import accountApiRequest from '@/apiRequests/account'
import { useEffect } from 'react'

export default function Profile() {
  useEffect(() => {
    accountApiRequest.meClient().then((res) => {
      console.log(res)
    })
  }, [])
  return <div>profile</div>
}
