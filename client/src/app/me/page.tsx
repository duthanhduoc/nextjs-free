import accountApiRequest from '@/apiRequests/account'
import ProfileForm from '@/app/me/profile-form'
import { cookies } from 'next/headers'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hồ sơ người dùng'
}

export default async function MeProfile() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('sessionToken')
  // Vì dùng cookie nên api này không được cached trên server
  // https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#opting-out-of-data-caching

  const result = await accountApiRequest.me(sessionToken?.value ?? '')
  return (
    <div>
      <h1>Profile</h1>
      <ProfileForm profile={result.payload.data} />
    </div>
  )
}
