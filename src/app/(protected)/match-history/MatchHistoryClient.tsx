'use client'

import { useEffect, useState } from 'react'
import {
  Container,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
} from '@mui/material'
import { useToast } from '@/components/ToastProvider'
import LoadingPage from '@/components/LoadingPage'
import { cache } from '@/lib/cache'

type Match = {
  id: string
  userId: string
  name: string
  gender: string
  status: 'pending' | 'accepted' | 'declined'
  createdAt: string
}

export default function MatchHistoryClient() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const { showToast } = useToast()

  useEffect(() => {
    // Try to load from cache first
    const cachedMatches = cache.get('matches')
    if (cachedMatches) {
      setMatches(cachedMatches)
      setLoading(false)
    }

    // Then fetch fresh data
    fetchMatches()
  }, [])

  const fetchMatches = async () => {
    try {
      const res = await fetch('/api/matches/history')
      if (!res.ok) throw new Error('Failed to fetch matches')
      const data = await res.json()
      
      setMatches(data)
      cache.set('matches', data)
    } catch (error) {
      showToast({
        message: '获取匹配记录失败',
        severity: 'error'
      })
      // If fetch fails and we have cached data, keep using it
      if (!matches.length) {
        const cachedMatches = cache.get('matches')
        if (cachedMatches) {
          setMatches(cachedMatches)
        }
      }
    } finally {
      setLoading(false)
    }
  }

  if (matches.length === 0 && !loading) {
    return (
      <Container>
        <Box sx={{ 
          mt: 4, 
          textAlign: 'center',
          color: 'text.secondary'
        }}>
          <Typography variant="h6">
            暂无匹配记录
          </Typography>
        </Box>
      </Container>
    )
  }

  return (
    <>
      <Container>
        <Box sx={{ mt: 2 }}>
          {matches.map((match) => (
            <Card key={match.id} sx={{ mb: 2 }}>
              <CardMedia
                component="img"
                height="200"
                image={`/static/images/${match.gender === 'female' ? 'girl' : 'man'}-${Math.floor(Math.random() * 3) + 1}.jpg`}
                alt={match.name}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {match.name}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(match.createdAt).toLocaleDateString()}
                  </Typography>
                  <Chip 
                    label={
                      match.status === 'pending' ? '等待中' :
                      match.status === 'accepted' ? '已接受' : '已拒绝'
                    }
                    color={
                      match.status === 'pending' ? 'warning' :
                      match.status === 'accepted' ? 'success' : 'error'
                    }
                    size="small"
                  />
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
      <LoadingPage open={loading} />
    </>
  )
} 