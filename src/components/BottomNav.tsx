'use client'

import { useState } from 'react'
import {
  Paper,
  BottomNavigation,
  BottomNavigationAction,
} from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import FavoriteIcon from '@mui/icons-material/Favorite'
import PersonIcon from '@mui/icons-material/Person'
import SettingsIcon from '@mui/icons-material/Settings'
import { useRouter, usePathname } from 'next/navigation'

export default function BottomNav() {
  const router = useRouter()
  const pathname = usePathname()

  const getCurrentValue = () => {
    if (pathname === '/home') return 0
    if (pathname === '/match-history') return 1
    if (pathname === '/profile') return 2
    if (pathname === '/settings') return 3
    return 0
  }

  return (
    <Paper 
      sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0,
        zIndex: 1000
      }} 
      elevation={3}
    >
      <BottomNavigation
        showLabels
        value={getCurrentValue()}
        onChange={(_, newValue) => {
          switch(newValue) {
            case 0:
              router.push('/home')
              break
            case 1:
              router.push('/match-history')
              break
            case 2:
              router.push('/profile')
              break
            case 3:
              router.push('/settings')
              break
          }
        }}
      >
        <BottomNavigationAction 
          label="首页" 
          icon={<HomeIcon />} 
        />
        <BottomNavigationAction 
          label="匹配记录" 
          icon={<FavoriteIcon />} 
        />
        <BottomNavigationAction 
          label="个人资料" 
          icon={<PersonIcon />} 
        />
        <BottomNavigationAction 
          label="设置" 
          icon={<SettingsIcon />} 
        />
      </BottomNavigation>
    </Paper>
  )
} 