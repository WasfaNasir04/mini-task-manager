import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeams, setCurrentTeam } from '../../features/teams/teamsSlice';
import { List, ListItem, ListItemText, Button, Box, Typography } from '@mui/material';

const TeamList = () => {
  const dispatch = useDispatch();
  const { teams, loading, error } = useSelector((state) => state.teams);

  useEffect(() => {
    dispatch(fetchTeams());
  }, [dispatch]);

  const handleTeamSelect = (team) => {
    dispatch(setCurrentTeam(team));
  };

  if (loading) return <Typography>Loading teams...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Your Teams
      </Typography>
      <List>
        {teams.map((team) => (
          <ListItem
            key={team.id}
            button
            onClick={() => handleTeamSelect(team)}
          >
            <ListItemText
              primary={team.name}
              secondary={`${team.members.length} members`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default TeamList;
