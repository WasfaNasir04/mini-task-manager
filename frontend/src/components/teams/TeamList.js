import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeams } from '../../features/teams/teamsSlice';
import { isAdmin } from '../../utils/roles';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const TeamList = ({ onCreateProject }) => {
  const dispatch = useDispatch();
  const { items: teams, status, error } = useSelector((state) => state.teams);
  const { user } = useSelector((state) => state.auth);

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

  if (status === 'failed') {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error || 'Failed to load teams'}
      </Alert>
    );
  }

  if (!teams || teams.length === 0) {
    return (
      <Box p={3}>
        <Typography variant="body1" color="textSecondary">
          No teams found. Create a team to get started.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {teams.map((team) => (
        <Card key={team.id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" component="h2">
              {team.name}
            </Typography>
            <Typography color="textSecondary">
              Members: {team.members?.length || 0}
            </Typography>
          </CardContent>
          <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
            {isAdmin(user?.role) && (
              <Button
                size="small"
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => onCreateProject(team.id)}
                sx={{ 
                  backgroundColor: '#026AA7',
                  '&:hover': {
                    backgroundColor: '#015585'
                  }
                }}
              >
                Create Project
              </Button>
            )}
          </CardActions>
        </Card>
      ))}
    </Box>
  );
};

export default TeamList;
