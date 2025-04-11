import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { isAdmin } from '../../utils/roles';
import CreateTeamForm from '../teams/CreateTeamForm';
import TeamList from '../teams/TeamList';
import CreateProjectForm from '../projects/CreateProjectForm';
import ProjectList from '../projects/ProjectList';
import KanbanBoard from '../tasks/KanbanBoard';
import TaskFilters from '../tasks/TaskFilters';
import NotificationsList from '../notifications/NotificationsList';
import CreateTaskForm from '../tasks/CreateTaskForm';
import { logoutUser } from '../../features/auth/authSlice';
import { 
  AccountCircle, 
  Add as AddIcon,
  Notifications as NotificationsIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
import { fetchProjects } from '../../features/projects/projectsSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const isUserAdmin = isAdmin(user?.role);
  
  // Menu states
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  
  // Dialog states
  const [createTeamOpen, setCreateTeamOpen] = useState(false);
  const [createProjectOpen, setCreateProjectOpen] = useState(false);
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenu = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  const handleCreateProject = (teamId) => {
    setSelectedTeamId(teamId);
    setCreateProjectOpen(true);
  };

  const handleCloseProjectDialog = () => {
    setCreateProjectOpen(false);
    setSelectedTeamId(null);
  };

  const handleCreateTask = (projectId) => {
    if (!projectId) {
      console.error("No project selected");
      return;
    }
    setSelectedProjectId(projectId);
    setCreateTaskOpen(true);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppBar position="static" sx={{ backgroundColor: '#026AA7' }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            sx={{ mr: 2 }}
          >
            <DashboardIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Task Manager
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              color="inherit"
              onClick={handleNotificationMenu}
            >
              <NotificationsIcon />
            </IconButton>
            <Typography variant="subtitle1">
              {user?.username}
            </Typography>
            <IconButton
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Menus */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>

      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleNotificationClose}
        PaperProps={{
          sx: { width: 320, maxHeight: 400 }
        }}
      >
        <NotificationsList />
      </Menu>

      {/* Main Content */}
      <Box sx={{ 
        p: 3, 
        backgroundColor: '#F0F2F5', 
        flexGrow: 1,
        overflowY: 'auto'
      }}>
        <Grid container spacing={3}>
          {/* Action Buttons */}
          {isUserAdmin && (
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setCreateTeamOpen(true)}
                  sx={{ backgroundColor: '#026AA7' }}
                >
                  Create Team
                </Button>
                {/* <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleCreateTask(selectedProjectId)}
                  sx={{ backgroundColor: '#026AA7' }}
                >
                  Create Task
                </Button> */}
              </Box>
            </Grid>
          )}

          {/* Teams Section */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ 
              p: 2, 
              backgroundColor: 'white',
              borderRadius: 2,
              boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
            }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Teams</Typography>
              <Divider sx={{ mb: 2 }} />
              <TeamList onCreateProject={handleCreateProject} />
            </Paper>
          </Grid>

          {/* Projects Section */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ 
              p: 2, 
              backgroundColor: 'white',
              borderRadius: 2,
              boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
            }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Projects</Typography>
              <Divider sx={{ mb: 2 }} />
              <ProjectList 
                onCreateTask={handleCreateTask}
              />
            </Paper>
          </Grid>

          {/* Tasks Section */}
          <Grid item xs={12}>
            <Paper sx={{ 
              p: 2, 
              backgroundColor: 'white',
              borderRadius: 2,
              boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Tasks</Typography>
                <TaskFilters />
              </Box>
              <Divider sx={{ mb: 2 }} />
              <KanbanBoard />
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Dialogs */}
      <Dialog 
        open={createTeamOpen} 
        onClose={() => setCreateTeamOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <CreateTeamForm onClose={() => setCreateTeamOpen(false)} />
      </Dialog>

      <Dialog 
        open={createProjectOpen} 
        onClose={handleCloseProjectDialog}
        maxWidth="sm"
        fullWidth
      >
        <CreateProjectForm 
          onClose={handleCloseProjectDialog} 
          teamId={selectedTeamId}
        />
      </Dialog>

      <Dialog 
        open={createTaskOpen} 
        onClose={() => setCreateTaskOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <CreateTaskForm 
          onClose={() => setCreateTaskOpen(false)} 
          projectId={selectedProjectId}
        />
      </Dialog>
    </Box>
  );
};

export default Dashboard;
