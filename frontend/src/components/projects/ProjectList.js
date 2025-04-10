import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects } from '../../features/projects/projectsSlice';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';

const ProjectList = ({ teamId }) => {
  const dispatch = useDispatch();
  const { projects, status, error } = useSelector((state) => state.projects);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

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

  const teamProjects = teamId 
    ? projects.filter(project => project.team.id === teamId)
    : projects;

  if (teamProjects.length === 0) {
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
      {teamProjects.map((project) => (
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
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default ProjectList;
