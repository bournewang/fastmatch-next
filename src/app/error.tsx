'use client'

import { useEffect } from 'react'
import {
  Container,
  Paper,
  Typography,
  Button,
  Box
} from '@mui/material'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2
        }}
      >
        <ErrorOutlineIcon color="error" sx={{ fontSize: 64 }} />
        <Typography variant="h5" gutterBottom>
          出错了
        </Typography>
        <Typography color="text.secondary" paragraph>
          抱歉，发生了一些错误。请尝试重新加载页面。
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Button 
            variant="contained" 
            onClick={reset}
          >
            重试
          </Button>
        </Box>
      </Paper>
    </Container>
  )
} 