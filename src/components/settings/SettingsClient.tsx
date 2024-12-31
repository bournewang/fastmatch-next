'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Container,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Divider
} from '@mui/material'
import { useOptimisticUpdate } from '@/lib/hooks/useOptimisticUpdate'
import PageTransition from '@/components/PageTransition'
import type { User } from '@/types'

interface SettingsClientProps {
  user: User
}

export default function SettingsClient({ user }: SettingsClientProps) {
  const router = useRouter()
  const [notifications, setNotifications] = useState(true)
  const [emailUpdates, setEmailUpdates] = useState(true)
  const [logoutDialog, setLogoutDialog] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState(false)

  const { execute: handleLogout } = useOptimisticUpdate(
    async () => {
      const res = await fetch('/api/auth/logout', { method: 'POST' })
      if (!res.ok) throw new Error('登出失败')
      router.push('/auth/login')
      router.refresh()
    },
    {
      successMessage: '已成功登出'
    }
  )

  const { execute: handleDeleteAccount } = useOptimisticUpdate(
    async () => {
      const res = await fetch('/api/profile/delete', { method: 'DELETE' })
      if (!res.ok) throw new Error('删除账号失败')
      router.push('/auth/login')
      router.refresh()
    },
    {
      successMessage: '账号已删除'
    }
  )

  return (
    <PageTransition>
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Paper elevation={3}>
          <List>
            <ListItem>
              <ListItemText 
                primary="新匹配通知" 
                secondary="当有新的匹配时通知我"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                />
              </ListItemSecondaryAction>
            </ListItem>

            <ListItem>
              <ListItemText 
                primary="邮件更新" 
                secondary="接收每周匹配邮件"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={emailUpdates}
                  onChange={(e) => setEmailUpdates(e.target.checked)}
                />
              </ListItemSecondaryAction>
            </ListItem>

            <Divider />

            <ListItem>
              <ListItemText 
                primary="账号" 
                secondary={user.email}
              />
            </ListItem>

            <ListItem>
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                onClick={() => setLogoutDialog(true)}
              >
                退出登录
              </Button>
            </ListItem>

            <ListItem>
              <Button
                fullWidth
                variant="outlined"
                color="error"
                onClick={() => setDeleteDialog(true)}
              >
                删除账号
              </Button>
            </ListItem>
          </List>
        </Paper>

        {/* Logout Dialog */}
        <Dialog open={logoutDialog} onClose={() => setLogoutDialog(false)}>
          <DialogTitle>退出登录</DialogTitle>
          <DialogContent>
            <DialogContentText>
              确定要退出登录吗？
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setLogoutDialog(false)}>取消</Button>
            <Button onClick={handleLogout} color="primary">
              确定
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Account Dialog */}
        <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
          <DialogTitle>删除账号</DialogTitle>
          <DialogContent>
            <DialogContentText>
              此操作将永久删除您的账号和所有相关数据，无法恢复。确定要继续吗？
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialog(false)}>取消</Button>
            <Button onClick={handleDeleteAccount} color="error">
              删除
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </PageTransition>
  )
} 