import LoginForm from '@/components/auth/LoginForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '登录 | FastMatch',
  description: '登录您的FastMatch账号',
}

export default function LoginPage() {
  return <LoginForm />
} 