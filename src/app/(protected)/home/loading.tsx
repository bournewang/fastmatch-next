import { Container, Skeleton, Card, CardContent, Box } from '@mui/material'

export default function HomeLoading() {
  return (
    <Container>
      <Box sx={{ mt: 2 }}>
        {[1, 2, 3].map((i) => (
          <Card key={i} sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Skeleton variant="circular" width={40} height={40} />
                <Box sx={{ ml: 2 }}>
                  <Skeleton width={120} height={24} />
                  <Skeleton width={80} height={20} />
                </Box>
              </Box>
              <Skeleton variant="rectangular" height={200} />
              <Box sx={{ mt: 2 }}>
                <Skeleton width="60%" height={24} />
                <Skeleton width="40%" height={20} />
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  )
} 