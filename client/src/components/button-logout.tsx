'use client'

import authApiRequest from '@/apiRequests/auth'
import { Button } from '@/components/ui/button'
import { handleErrorApi } from '@/lib/utils'
import { useRouter } from 'next/navigation'

export default function ButtonLogout() {
  const router = useRouter()
  const handleLogout = async () => {
    try {
      await authApiRequest.logoutFromNextClientToNextServer()
      router.push('/login')
    } catch (error) {
      handleErrorApi({
        error
      })
    }
  }
  return (
    <Button size={'sm'} onClick={handleLogout}>
      Đăng xuất
    </Button>
  )
}
