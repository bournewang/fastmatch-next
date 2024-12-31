import { Metadata } from 'next'
import { getUser } from '@/lib/auth'
import SettingsClient from '@/components/settings/SettingsClient'

export const metadata: Metadata = {
  title: '设置 | FastMatch',
  description: '管理您的账户设置',
}

export default async function SettingsPage() {
  const user = await getUser()
  if (!user) return null

  return <SettingsClient user={user} />
} 