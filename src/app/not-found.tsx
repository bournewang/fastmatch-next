import {
  Container,
  Paper,
  Typography,
  Button,
  Box
} from '@mui/material'
import SearchOffIcon from '@mui/icons-material/SearchOff'
import Link from 'next/link'

export default function NotFound() {
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
        <SearchOffIcon sx={{ fontSize: 64, color: 'text.secondary' }} />
        <Typography variant="h5" gutterBottom>
          页面不存在
        </Typography>
        <Typography color="text.secondary" paragraph>
          抱歉，您访问的页面不存在。
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Link href="/home" style={{ textDecoration: 'none' }}>
            <Button variant="contained">
              返回首页
            </Button>
          </Link>
        </Box>
      </Paper>
    </Container>
  )
} 