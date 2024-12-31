'use client'

import { useState } from 'react'
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Alert
} from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import CloseIcon from '@mui/icons-material/Close'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import SchoolIcon from '@mui/icons-material/School'
import WorkIcon from '@mui/icons-material/Work'
import { useOptimisticUpdate } from '@/lib/hooks/useOptimisticUpdate'
import PageTransition from '@/components/PageTransition'
import type { Match, User } from '@/types'

export interface HomeClientProps {
  initialMatch: Match | null
  currentUser: User
}

interface MatchActionResponse {
  success: boolean
}

export default function HomeClient({ initialMatch, currentUser }: HomeClientProps) {
  const [match, setMatch] = useState(initialMatch)
  
  const handleAccept = useOptimisticUpdate<MatchActionResponse>(
    async () => {
      const res = await fetch(`/api/matches/${match?.id}/accept`, {
        method: 'POST'
      })
      if (!res.ok) throw new Error('操作失败')
      return res.json()
    },
    {
      successMessage: '已接受匹配',
      onSuccess: () => setMatch(null)
    }
  )

  const handleDecline = useOptimisticUpdate<MatchActionResponse>(
    async () => {
      const res = await fetch(`/api/matches/${match?.id}/decline`, {
        method: 'POST'
      })
      if (!res.ok) throw new Error('操作失败')
      return res.json()
    },
    {
      successMessage: '已婉拒匹配',
      onSuccess: () => setMatch(null)
    }
  )

  if (!match) {
    return (
      <PageTransition>
        <Container maxWidth="sm" sx={{ py: 4 }}>
          <Alert severity="info">
            {currentUser.gender === 'female' 
              ? '本周暂无合适的匹配对象，请稍后再来查看。'
              : '本周暂无新的匹配，请稍后再来查看。'
            }
          </Alert>
        </Container>
      </PageTransition>
    )
  }

  const matchedUser = match.matched_user
  const isMatchedUserMale = matchedUser?.gender === 'male'

  return (
    <PageTransition>
      <Container maxWidth="sm" sx={{ py: 2 }}>
        <Paper elevation={3}>
          <Box
            sx={{
              position: 'relative',
              paddingTop: '100%',
              backgroundImage: `url(/static/images/${isMatchedUserMale ? 'man' : 'girl'}-1.jpg)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <Box sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
              {matchedUser?.name}
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocationOnIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography color="text.secondary">
                  {matchedUser?.location}
                </Typography>
              </Box>
              
              {matchedUser?.education && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <SchoolIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography color="text.secondary">
                    {matchedUser.education}
                  </Typography>
                </Box>
              )}
              
              {matchedUser?.career_id && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <WorkIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography color="text.secondary">
                    {matchedUser.career_id}
                  </Typography>
                </Box>
              )}
            </Box>

            {matchedUser?.about && (
              <Typography 
                color="text.secondary" 
                sx={{ mb: 2 }}
              >
                {matchedUser.about}
              </Typography>
            )}

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                color="error"
                startIcon={<CloseIcon />}
                fullWidth
                onClick={handleDecline.execute}
                disabled={handleDecline.loading || handleAccept.loading}
              >
                婉拒
              </Button>
              <Button
                variant="contained"
                color="success"
                startIcon={<FavoriteIcon />}
                fullWidth
                onClick={handleAccept.execute}
                disabled={handleDecline.loading || handleAccept.loading}
              >
                接受
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </PageTransition>
  )
} 