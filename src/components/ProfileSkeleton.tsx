import { Card, CardContent, Skeleton, Box } from '@mui/material'

export default function ProfileSkeleton() {
  return (
    <Card sx={{ mb: 2 }}>
      <Skeleton variant="rectangular" height={300} />
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Skeleton variant="circular" width={40} height={40} />
          <Box sx={{ ml: 2 }}>
            <Skeleton width={120} height={24} />
            <Skeleton width={80} height={20} />
          </Box>
        </Box>
        <Skeleton width="90%" height={20} />
        <Skeleton width="80%" height={20} />
      </CardContent>
    </Card>
  )
} 