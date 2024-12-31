import { Container, Box } from '@mui/material'
import ProfileSkeleton from '@/components/ProfileSkeleton'

export default function MatchHistoryLoading() {
  return (
    <Container>
      <Box sx={{ mt: 2 }}>
        {[1, 2, 3].map((i) => (
          <ProfileSkeleton key={i} />
        ))}
      </Box>
    </Container>
  )
} 