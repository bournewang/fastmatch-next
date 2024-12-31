import {
  Container,
  Paper,
  Skeleton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box
} from '@mui/material'

export default function SettingsLoading() {
  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3}>
        <List>
          {[1, 2].map((item) => (
            <ListItem key={item}>
              <ListItemText
                primary={<Skeleton width="40%" />}
                secondary={<Skeleton width="60%" />}
              />
              <Skeleton width={34} height={20} />
            </ListItem>
          ))}

          <Divider />

          <ListItem>
            <ListItemText
              primary={<Skeleton width="30%" />}
              secondary={<Skeleton width="50%" />}
            />
          </ListItem>

          <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Skeleton variant="rectangular" height={36} />
            <Skeleton variant="rectangular" height={36} />
          </Box>
        </List>
      </Paper>
    </Container>
  )
} 