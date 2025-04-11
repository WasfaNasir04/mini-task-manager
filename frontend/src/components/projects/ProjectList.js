import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects, assignProjectMember } from '../../features/projects/projectsSlice';
import { isAdmin } from '../../utils/roles';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { teamsApi } from '../../services/api';

const ProjectList = ({ teamId, onCreateTask }) => {
  const dispatch = useDispatch();
  const { projects, status, error } = useSelector((state) => state.projects);
  const { user } = useSelector((state) => state.auth);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [teamMembers, setTeamMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const fetchTeamMembers = async (teamId) => {
    setLoadingMembers(true);
    try {
      // Fetch all members with the MEMBER role
      const response = await teamsApi.getMembers(teamId); // This now returns all MEMBERs
      setTeamMembers(response.data || []);
      console.log('Fetched members:', response.data);
    } catch (err) {
      console.error('Failed to fetch team members:', err);
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleAssignMember = (projectId, teamId) => {
    if (!projectId) {
      console.error("Project ID is required");
      return;
    }
    dispatch(fetchProjects()).then(() => {
      setSelectedProjectId(projectId);
      fetchTeamMembers(teamId);
      setAssignDialogOpen(true);
    });
  };

  const handleAssignSubmit = async () => {
    if (!selectedProjectId || !selectedMemberId) return;
    await dispatch(
      assignProjectMember({ projectId: selectedProjectId, userId: selectedMemberId })
    ).unwrap();
    setAssignDialogOpen(false);
  };

  if (status === 'loading') {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (status === 'failed') {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error || 'Failed to load projects'}
      </Alert>
    );
  }

  const filteredProjects = teamId
    ? projects.filter(project => {
        if (isAdmin(user?.role)) {
          return project.team.id === teamId;
        } else {
          return (
            project.team.id === teamId &&
            project.assigned_members?.some(member => member.id === user?.id)
          );
        }
      })
    : projects.filter(project => {
        if (isAdmin(user?.role)) {
          return true;
        } else {
          return project.assigned_members?.some(member => member.id === user?.id);
        }
      });

  if (filteredProjects.length === 0) {
    return (
      <Box p={3}>
        <Typography variant="body1" color="textSecondary">
          No projects found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {filteredProjects.map((project) => (
        <Card key={project.id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" component="h3">
              {project.name}
            </Typography>
            <Typography color="textSecondary" variant="body2">
              {project.description}
            </Typography>
            <Typography color="textSecondary" variant="body2" sx={{ mt: 1 }}>
              Team: {project.team.name}
            </Typography>
            <Typography color="textSecondary" variant="body2" sx={{ mt: 1 }}>
              Assigned Members: {project.assigned_members?.map(member => member.username).join(', ') || 'None'}
            </Typography>
            {isAdmin(user?.role) && (
              <Button
                size="small"
                variant="contained"
                onClick={() => handleAssignMember(project.id, project.team.id)}
                sx={{ 
                  mt: 1,
                  backgroundColor: '#026AA7',
                  '&:hover': {
                    backgroundColor: '#015585'
                  }
                }}
              >
                Assign Member
              </Button>
            )}
            <Button
              onClick={() => onCreateTask(project.id)}
            >
              Create Task
            </Button>
          </CardContent>
        </Card>
      ))}

      {/* Member Assignment Dialog */}
      <Dialog open={assignDialogOpen} onClose={() => setAssignDialogOpen(false)}>
        <DialogTitle>Assign Member to Project</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Select Member</InputLabel>
            <Select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              label="Select Member"
              disabled={loadingMembers}
            >
              {loadingMembers ? (
                <MenuItem disabled>Loading members...</MenuItem>
              ) : (
                teamMembers.map((member) => (
                  <MenuItem key={member.id} value={member.id}>
                    {member.username} ({member.role})
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAssignSubmit} variant="contained" disabled={loadingMembers}>
            Assign
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProjectList;
