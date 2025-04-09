import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects, setCurrentProject } from '../../features/projects/projectsSlice';
import { List, ListItem, ListItemText, Box, Typography } from '@mui/material';

const ProjectList = ({ teamId }) => {
  const dispatch = useDispatch();
  const { projects, loading, error } = useSelector((state) => state.projects);

  useEffect(() => {
    if (teamId) {
      dispatch(fetchProjects(teamId));
    }
  }, [dispatch, teamId]);

  const handleProjectSelect = (project) => {
    dispatch(setCurrentProject(project));
  };

  if (loading) return <Typography>Loading projects...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Projects
      </Typography>
      <List>
        {projects.map((project) => (
          <ListItem
            key={project.id}
            button
            onClick={() => handleProjectSelect(project)}
          >
            <ListItemText
              primary={project.name}
              secondary={project.description}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ProjectList;
