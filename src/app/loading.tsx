import {
  Container,
  Paper,
  CircularProgress
} from '@mui/material'

export default function Loading() {
  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          display: 'flex', 
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 200
        }}
      >
        <CircularProgress />
      </Paper>
    </Container>
  )
} 