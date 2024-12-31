'use client'

import {
  Container,
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip
} from '@mui/material'
import PageTransition from '@/components/PageTransition'
import type { Match } from '@/types'

interface MatchHistoryClientProps {
  matches: Match[]
}

const getStatusColor = (status: Match['status']) => {
  switch (status) {
    case 'accepted':
      return 'success'
    case 'declined':
      return 'error'
    case 'expired':
      return 'warning'
    default:
      return 'default'
  }
}

const getStatusText = (status: Match['status']) => {
  switch (status) {
    case 'accepted':
      return '已接受'
    case 'declined':
      return '已婉拒'
    case 'expired':
      return '已过期'
    default:
      return '等待中'
  }
}

export default function MatchHistoryClient({ matches }: MatchHistoryClientProps) {
  if (matches.length === 0) {
    return (
      <PageTransition>
        <Container maxWidth="sm" sx={{ py: 4 }}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography align="center" color="text.secondary">
              暂无匹配记录
            </Typography>
          </Paper>
        </Container>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <Container maxWidth="sm" sx={{ py: 2 }}>
        <Paper elevation={3}>
          <List>
            {matches.map((match) => (
              <Box key={match.id}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar
                      src={`/static/images/${match.matched_user?.gender === 'female' ? 'girl' : 'man'}-1.jpg`}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={match.matched_user?.name}
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.secondary"
                        >
                          {match.matched_user?.location}
                        </Typography>
                        <Chip
                          size="small"
                          label={getStatusText(match.status)}
                          color={getStatusColor(match.status)}
                        />
                      </Box>
                    }
                  />
                </ListItem>
              </Box>
            ))}
          </List>
        </Paper>
      </Container>
    </PageTransition>
  )
} 