import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, List, ListItem, ListItemText, Typography, CircularProgress, IconButton } from '@mui/material';
import { fetchNotifications, markNotificationAsRead } from '../../features/notifications/notificationsSlice';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';

const NotificationsList = () => {
  const dispatch = useDispatch();
  const { notifications, loading, error } = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMarkAsRead = (notificationId) => {
    dispatch(markNotificationAsRead(notificationId));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error">Error loading notifications: {error}</Typography>
      </Box>
    );
  }

  if (!notifications || notifications.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>No notifications</Typography>
      </Box>
    );
  }

  return (
    <List>
      {notifications.map((notification) => (
        <ListItem
          key={notification.id}
          secondaryAction={
            !notification.is_read && (
              <IconButton
                edge="end"
                onClick={() => handleMarkAsRead(notification.id)}
                color="primary"
              >
                <CheckCircleIcon />
              </IconButton>
            )
          }
          sx={{
            bgcolor: notification.is_read ? 'background.paper' : 'action.hover',
            mb: 1,
            borderRadius: 1,
          }}
        >
          <ListItemText
            primary={notification.message}
            secondary={new Date(notification.created_at).toLocaleString()}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default NotificationsList;
