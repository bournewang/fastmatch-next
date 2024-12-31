import { Suspense } from 'react'
import ProfileClient from './ProfileClient'
import ProfileLoading from './loading'

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileLoading />}>
      <ProfileClient />
    </Suspense>
  )
} 