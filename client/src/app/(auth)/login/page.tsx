'use client'
import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('duthanhduoc@gmail.com')
  console.log('LoginPage')
  return (
    <div>
      Login page
      {email}
    </div>
  )
}
