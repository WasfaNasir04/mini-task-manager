import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../features/auth/authSlice';
import { Button, AppBar, Toolbar, Typography, Box } from '@mui/material';
import CreateTaskForm from '../tasks/CreateTaskForm';
import TeamList from '../teams/TeamList';
import CreateTeamForm from '../teams/CreateTeamForm';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openCreateTeam, setOpenCreateTeam] = React.useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Task Manager
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      
      <Box sx={{ p: 3 }}>
        <Button 
          variant="contained" 
          onClick={() => setOpenCreateTeam(true)}
          sx={{ mb: 2 }}
        >
          Create Team
        </Button>
        
        <TeamList />
        <CreateTeamForm 
          open={openCreateTeam} 
          onClose={() => setOpenCreateTeam(false)} 
        />
      </Box>
    </Box>
  );
};

export default Dashboard;
