import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Box,
  TextField,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from '@mui/material';
import { createTeam } from '../../features/teams/teamsSlice';

const CreateTeamForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const [teamName, setTeamName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!teamName.trim()) {
      setError('Team name is required');
      return;
    }

    try {
      await dispatch(createTeam({ name: teamName })).unwrap();
      setTeamName('');
      setError('');
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create team');
    }
  };

  return (
    <Box>
      <DialogTitle>
        <Typography variant="h6">Create New Team</Typography>
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Team Name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            error={!!error}
            helperText={error}
            autoFocus
            margin="normal"
            variant="outlined"
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{ backgroundColor: '#026AA7' }}
        >
          Create Team
        </Button>
      </DialogActions>
    </Box>
  );
};

export default CreateTeamForm;
