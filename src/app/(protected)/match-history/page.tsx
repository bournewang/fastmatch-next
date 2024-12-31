import { Suspense } from 'react'
import MatchHistoryClient from './MatchHistoryClient'
import MatchHistoryLoading from './loading'

export default function MatchHistoryPage() {
  return (
    <Suspense fallback={<MatchHistoryLoading />}>
      <MatchHistoryClient />
    </Suspense>
  )
} 