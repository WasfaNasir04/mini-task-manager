import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, markAsRead } from '../../features/notifications/notificationsSlice';
import { 
  List, 
  ListItem, 
  ListItemText, 
  Typography, 
  IconButton,
  Badge,
  Menu,
  MenuItem
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';

const NotificationsList = () => {
  const dispatch = useDispatch();
  const { notifications, unreadCount } = useSelector((state) => state.notifications);
  const [anchorEl, setAnchorEl] = React.useState(null);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAsRead = async (notificationId) => {
    await dispatch(markAsRead(notificationId));
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {notifications.map((notification) => (
          <MenuItem
            key={notification.id}
            onClick={() => handleMarkAsRead(notification.id)}
            sx={{ 
              bgcolor: notification.is_read ? 'inherit' : 'action.hover',
              minWidth: 300
            }}
          >
            <ListItemText
              primary={notification.message}
              secondary={new Date(notification.created_at).toLocaleString()}
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default NotificationsList;
