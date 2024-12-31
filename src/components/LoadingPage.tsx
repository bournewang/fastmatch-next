import { Container, CircularProgress, Box, Fade } from '@mui/material'

type Props = {
  open?: boolean
}

export default function LoadingPage({ open = true }: Props) {
  return (
    <Fade in={open} unmountOnExit>
      <Box 
        sx={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          zIndex: 1300
        }}
      >
        <CircularProgress />
      </Box>
    </Fade>
  )
} 