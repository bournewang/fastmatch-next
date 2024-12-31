'use client'

import { useEffect, useState } from 'react'
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import SchoolIcon from '@mui/icons-material/School'
import WorkIcon from '@mui/icons-material/Work'
import EditIcon from '@mui/icons-material/Edit'
import { useToast } from '@/components/ToastProvider'
import LoadingPage from '@/components/LoadingPage'
import { cache } from '@/lib/cache'
import type { User, Career } from '@/types'
import {
  COMPANY_TYPE_LABELS,
  ANNUAL_INCOME_LABELS,
  EDUCATION_LABELS
} from '@/types/enums'
import BusinessIcon from '@mui/icons-material/Business'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'

export default function ProfileClient() {
  const [profile, setProfile] = useState<User | null>(null)
  const [careers, setCareers] = useState<Career[]>([])
  const [loading, setLoading] = useState(true)
  const [editOpen, setEditOpen] = useState(false)
  const [editForm, setEditForm] = useState<Partial<User>>({})
  const [useCustomCareer, setUseCustomCareer] = useState(false)
  const { showToast } = useToast()

  useEffect(() => {
    const cachedProfile = cache.get('userProfile')
    if (cachedProfile) {
      setProfile(cachedProfile)
      setEditForm(cachedProfile)
      setUseCustomCareer(!!cachedProfile.career_name)
      setLoading(false)
    }
    
    fetchProfile()
    fetchCareers()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/profile')
      if (!res.ok) throw new Error('Failed to fetch profile')
      const data = await res.json()
      
      setProfile(data)
      setEditForm(data)
      setUseCustomCareer(!!data.career_name)
      cache.set('userProfile', data)
    } catch (error) {
      showToast({
        message: '获取个人资料失败',
        severity: 'error'
      })
      if (!profile) {
        const cachedProfile = cache.get('userProfile')
        if (cachedProfile) {
          setProfile(cachedProfile)
          setEditForm(cachedProfile)
          setUseCustomCareer(!!cachedProfile.career_name)
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchCareers = async () => {
    try {
      const res = await fetch('/api/careers')
      if (!res.ok) throw new Error('Failed to fetch careers')
      const data = await res.json()
      setCareers(data)
    } catch (error) {
      console.error('Failed to fetch careers:', error)
    }
  }

  const handleEditSubmit = async () => {
    try {
        console.log(editForm)
      setLoading(true)
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...editForm
        }),
      })

      if (!res.ok) throw new Error('Failed to update profile')

      const updatedProfile = await res.json()
      setProfile(updatedProfile)
      cache.set('userProfile', updatedProfile)
      setEditOpen(false)
      showToast({
        message: '更新成功',
        severity: 'success',
      })
    } catch (error) {
      showToast({
        message: '更新失败',
        severity: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target
    
    if (name === 'career_id') {
      // When career_id changes, find the corresponding career name
      const selectedCareer = careers.find(c => c.id === Number(value))
      setEditForm(prev => ({
        ...prev,
        career_id: value as number,
        career_name: selectedCareer?.name
      }))
    } else if (name === 'career_name') {
      setEditForm(prev => ({
        ...prev,
        career_name: value as string,
        career_id: null 
      }))
    } else {
      setEditForm(prev => ({
        ...prev,
        [name as string]: value
      }))
    }
  }

  const getCareerDisplay = () => {
    if (profile?.career_name) return profile.career_name
    if (profile?.career_id) {
      const career = careers.find(c => c.id === profile.career_id)
      return career?.name || '未知职业'
    }
    return '未设置'
  }

  if (!profile && !loading) {
    return (
      <Container>
        <Box sx={{ mt: 4, textAlign: 'center', color: 'text.secondary' }}>
          <Typography variant="h6">获取资料失败</Typography>
        </Box>
      </Container>
    )
  }

  return (
    <>
      <Container maxWidth="sm">
        <Box sx={{ mt: 4 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button startIcon={<EditIcon />} onClick={() => setEditOpen(true)}>
                  编辑资料
                </Button>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar sx={{ width: 120, height: 120, mb: 2 }}>
                  {profile?.name?.[0]}
                </Avatar>
                <Typography variant="h5" gutterBottom>
                  {profile?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {profile?.email}
                </Typography>
                
                <List sx={{ width: '100%', mt: 2 }}>
                  <Divider />
                  <ListItem>
                    <ListItemIcon>
                      <LocationOnIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="所在地"
                      secondary={profile?.location || '未设置'}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemIcon>
                      <WorkIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="职业"
                      secondary={profile?.career_name || '未设置'}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemIcon>
                      <BusinessIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="公司类型"
                      secondary={profile?.company_type !== undefined ? COMPANY_TYPE_LABELS[profile.company_type] : '未设置'}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemIcon>
                      <MonetizationOnIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="年收入"
                      secondary={profile?.annual_income !== undefined ? ANNUAL_INCOME_LABELS[profile.annual_income] : '未设置'}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemIcon>
                      <SchoolIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="学历"
                      secondary={profile?.education !== undefined ? EDUCATION_LABELS[profile.education] : '未设置'}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemIcon>
                      <SchoolIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="学校"
                      secondary={profile?.school || '未设置'}
                    />
                  </ListItem>
                  <Divider />
                </List>
                
                <Box sx={{ mt: 3, width: '100%' }}>
                  <Typography variant="subtitle1" gutterBottom>
                    个人简介
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {profile?.about || '这个人很懒，什么都没写~'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>编辑个人资料</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="姓名"
              name="name"
              value={editForm.name || ''}
              onChange={handleChange}
              margin="normal"
            />
            
            <TextField
              fullWidth
              label="所在地"
              name="location"
              value={editForm.location || ''}
              onChange={handleChange}
              margin="normal"
            />

            <FormControl fullWidth margin="normal">
              <RadioGroup
                row
                value={useCustomCareer ? 'custom' : 'predefined'}
                onChange={(e) => setUseCustomCareer(e.target.value === 'custom')}
              >
                <FormControlLabel value="predefined" control={<Radio />} label="选择职业" />
                <FormControlLabel value="custom" control={<Radio />} label="自定义职业" />
              </RadioGroup>
            </FormControl>

            {useCustomCareer ? (
              <TextField
                fullWidth
                label="职业"
                name="career_name"
                value={editForm.career_name || ''}
                onChange={handleChange}
                margin="normal"
              />
            ) : (
              <FormControl fullWidth margin="normal">
                <InputLabel>职业</InputLabel>
                <Select
                  name="career_id"
                  value={editForm.career_id || ''}
                  onChange={handleChange}
                  label="职业"
                >
                  {careers.map(career => (
                    <MenuItem key={career.id} value={career.id}>
                      {career.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            <FormControl fullWidth margin="normal">
              <InputLabel>公司类型</InputLabel>
              <Select
                name="company_type"
                value={editForm.company_type ?? ''}
                onChange={handleChange}
                label="公司类型"
              >
                {Object.entries(COMPANY_TYPE_LABELS).map(([value, label]) => (
                  <MenuItem key={value} value={Number(value)}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>年收入</InputLabel>
              <Select
                name="annual_income"
                value={editForm.annual_income ?? ''}
                onChange={handleChange}
                label="年收入"
              >
                {Object.entries(ANNUAL_INCOME_LABELS).map(([value, label]) => (
                  <MenuItem key={value} value={Number(value)}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>学历</InputLabel>
              <Select
                name="education"
                value={editForm.education ?? ''}
                onChange={handleChange}
                label="学历"
              >
                {Object.entries(EDUCATION_LABELS).map(([value, label]) => (
                  <MenuItem key={value} value={Number(value)}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="学校"
              name="school"
              value={editForm.school || ''}
              onChange={handleChange}
              margin="normal"
            />

            <TextField
              fullWidth
              label="个人简介"
              name="about"
              value={editForm.about || ''}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={4}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>取消</Button>
          <Button onClick={handleEditSubmit} variant="contained">
            保存
          </Button>
        </DialogActions>
      </Dialog>

      <LoadingPage open={loading} />
    </>
  )
} 