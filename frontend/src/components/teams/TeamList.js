import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeams } from '../../features/teams/teamsSlice';
import { 
  List, 
  ListItem, 
  ListItemText, 
  Typography, 
  Paper,
  CircularProgress,
  Box
} from '@mui/material';

const TeamList = () => {
  const dispatch = useDispatch();
  const { items: teams, status, error } = useSelector((state) => state.teams);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTeams());
    }
  }, [status, dispatch]);

  if (status === 'loading') {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center">
        Error: {error}
      </Typography>
    );
  }

  if (!teams || teams.length === 0) {
    return (
      <Typography align="center">
        No teams found. Create your first team!
      </Typography>
    );
  }

  return (
    <Paper elevation={2} sx={{ mt: 2 }}>
      <List>
        {teams.map((team) => (
          <ListItem key={team.id}>
            <ListItemText
              primary={team.name}
              secondary={`Members: ${team.members?.length || 0}`}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default TeamList;
