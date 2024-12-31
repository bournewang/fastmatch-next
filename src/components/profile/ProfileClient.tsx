'use client'

import { useState } from 'react'
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  IconButton,
  Button,
  Avatar,
  Grid
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import { useOptimisticUpdate } from '@/lib/hooks/useOptimisticUpdate'
import PageTransition from '@/components/PageTransition'
import type { User } from '@/types'

interface ProfileClientProps {
  initialUser: User
}

export default function ProfileClient({ initialUser }: ProfileClientProps) {
  const [user, setUser] = useState(initialUser)
  const [editing, setEditing] = useState(false)

  const { execute: updateProfile, loading } = useOptimisticUpdate(
    async () => {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      })
      if (!res.ok) throw new Error('更新失败')
      return res.json()
    },
    {
      successMessage: '个人资料已更新',
      onSuccess: () => setEditing(false)
    }
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateProfile()
  }

  return (
    <PageTransition>
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Avatar
              sx={{ width: 100, height: 100, mr: 2 }}
              src={`/static/images/${user.gender === 'female' ? 'girl' : 'man'}-1.jpg`}
            />
            <Box>
              <Typography variant="h5">{user.name}</Typography>
              <Typography color="textSecondary">{user.email}</Typography>
            </Box>
            <IconButton 
              sx={{ ml: 'auto' }} 
              onClick={() => setEditing(!editing)}
            >
              <EditIcon />
            </IconButton>
          </Box>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="姓名"
                  value={user.name}
                  disabled={!editing}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="地区"
                  value={user.location || ''}
                  disabled={!editing}
                  onChange={(e) => setUser({ ...user, location: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="教育背景"
                  value={user.education || ''}
                  disabled={!editing}
                  onChange={(e) => setUser({ ...user, education: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="职业"
                  value={user.career_name || ''}
                  disabled={!editing}
                  onChange={(e) => setUser({ ...user, career_name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="个人简介"
                  value={user.about || ''}
                  disabled={!editing}
                  onChange={(e) => setUser({ ...user, about: e.target.value })}
                />
              </Grid>
            </Grid>

            {editing && (
              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setEditing(false)
                    setUser(initialUser)
                  }}
                  disabled={loading}
                  fullWidth
                >
                  取消
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  fullWidth
                >
                  {loading ? '保存中...' : '保存'}
                </Button>
              </Box>
            )}
          </form>
        </Paper>
      </Container>
    </PageTransition>
  )
} 