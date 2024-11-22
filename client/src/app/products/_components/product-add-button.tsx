'use client'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function ProductAddButton() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  useEffect(() => {
    setIsAuthenticated(Boolean(localStorage.getItem('sessionToken')))
  }, [])

  if (!isAuthenticated) return null
  return (
    <Link href={'/products/add'}>
      <Button variant={'secondary'}>Thêm sản phẩm</Button>
    </Link>
  )
}
