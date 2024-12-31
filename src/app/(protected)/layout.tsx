import { Suspense } from 'react'
import { Box } from '@mui/material'
import BottomNav from '@/components/BottomNav'
import LoadingPage from '@/components/LoadingPage'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Box sx={{ pb: 7 }}>
      <Suspense fallback={<LoadingPage />}>
        {children}
      </Suspense>
      <BottomNav />
    </Box>
  )
} 