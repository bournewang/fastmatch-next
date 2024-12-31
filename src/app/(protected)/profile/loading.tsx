import { Container, Skeleton, Box, Card, CardContent } from '@mui/material'

export default function ProfileLoading() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Skeleton variant="circular" width={120} height={120} />
              <Box sx={{ mt: 2, width: '100%' }}>
                <Skeleton height={32} width="60%" sx={{ mx: 'auto' }} />
                <Skeleton height={24} width="40%" sx={{ mx: 'auto', mt: 1 }} />
              </Box>
              <Box sx={{ mt: 4, width: '100%' }}>
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} height={60} sx={{ mb: 2 }} />
                ))}
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  )
} 