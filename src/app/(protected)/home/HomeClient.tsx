'use client'

import { useEffect, useState } from 'react'
import type { User } from '@/types'
import {
  Container,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton,
  Avatar,
} from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import CloseIcon from '@mui/icons-material/Close'
import { useToast } from '@/components/ToastProvider'
import LoadingPage from '@/components/LoadingPage'
import { cache } from '@/lib/cache'

export default function HomeClient() {
  const [profiles, setProfiles] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const { showToast } = useToast()

  useEffect(() => {
    // Try to load from cache first
    const cachedProfiles = cache.get('profiles')
    if (cachedProfiles) {
      setProfiles(cachedProfiles)
      setLoading(false)
    }

    // Then fetch fresh data
    fetchProfiles()
  }, [])

  const fetchProfiles = async () => {
    try {
      const res = await fetch('/api/profiles')
      if (!res.ok) throw new Error('Failed to fetch profiles')
      const data = await res.json()
      
      setProfiles(data)
      cache.set('profiles', data)  // Cache the fresh data
    } catch (error) {
      showToast({
        message: '获取推荐失败',
        severity: 'error'
      })
      // If fetch fails and we have cached data, keep using it
      if (!profiles.length) {
        const cachedProfiles = cache.get('profiles')
        if (cachedProfiles) {
          setProfiles(cachedProfiles)
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (profileId: string) => {
    try {
      setLoading(true)
      const res = await fetch('/api/matches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ profileId, action: 'like' })
      })
      
      if (!res.ok) throw new Error('Failed to like profile')
      
      setProfiles(prev => prev.filter(p => p.id !== profileId))
      showToast({
        message: '已喜欢',
        severity: 'success'
      })
    } catch (error) {
      showToast({
        message: '操作失败',
        severity: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePass = async (profileId: string) => {
    try {
      setLoading(true)
      const res = await fetch('/api/matches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ profileId, action: 'pass' })
      })
      
      if (!res.ok) throw new Error('Failed to pass profile')
      
      setProfiles(prev => prev.filter(p => p.id !== profileId))
      showToast({
        message: '已跳过',
        severity: 'info'
      })
    } catch (error) {
      showToast({
        message: '操作失败',
        severity: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  if (profiles.length === 0 && !loading) {
    return (
      <Container>
        <Box sx={{ 
          mt: 4, 
          textAlign: 'center',
          color: 'text.secondary'
        }}>
          <Typography variant="h6">
            暂无更多推荐
          </Typography>
          <Typography variant="body2">
            请稍后再来看看
          </Typography>
        </Box>
      </Container>
    )
  }

  return (
    <>
      <Container>
        <Box sx={{ mt: 2 }}>
          {profiles.map((profile) => (
            <Card key={profile.id} sx={{ mb: 2 }}>
              <CardMedia
                component="img"
                height="300"
                image={`/static/images/${profile.gender === 1 ? 'girl' : 'man'}-${Math.floor(Math.random() * 3) + 1}.jpg`}
                alt={profile.name}
              />
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar sx={{ mr: 2 }}>{profile.name[0]}</Avatar>
                  <Box>
                    <Typography variant="h6" component="div">
                      {profile.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {profile.location} · {profile.career_name || '未设置职业'}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  {profile.about || '这个人很懒，什么都没写~'}
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-around', 
                  mt: 2 
                }}>
                  <IconButton 
                    onClick={() => handlePass(profile.id)}
                    color="default"
                    sx={{ 
                      border: '2px solid',
                      borderColor: 'grey.300'
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleLike(profile.id)}
                    color="error"
                    sx={{ 
                      border: '2px solid',
                      borderColor: 'error.main'
                    }}
                  >
                    <FavoriteIcon />
                  </IconButton>
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