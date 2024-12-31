'use client'

import { useState } from 'react'
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Box
} from '@mui/material'
import AccountCircle from '@mui/icons-material/AccountCircle'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Navbar() {
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST'
      })
      if (res.ok) {
        router.push('/login')
      }
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1 }}
        >
          FastMatch
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Link href="/home" style={{ 
            color: 'white', 
            textDecoration: 'none' 
          }}>
            首页
          </Link>
          <Link href="/matches" style={{ 
            color: 'white', 
            textDecoration: 'none' 
          }}>
            匹配记录
          </Link>
          <Link href="/chat" style={{ 
            color: 'white', 
            textDecoration: 'none' 
          }}>
            聊天
          </Link>
        </Box>
        <div>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={() => {
              handleClose()
              router.push('/profile')
            }}>
              个人资料
            </MenuItem>
            <MenuItem onClick={() => {
              handleClose()
              handleLogout()
            }}>
              退出登录
            </MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  )
} 