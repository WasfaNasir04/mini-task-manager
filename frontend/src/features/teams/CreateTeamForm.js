import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createTeam } from '../../features/teams/teamsSlice';
import { TextField, Button, Box, Typography, Paper } from '@mui/material';

const CreateTeamForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createTeam(formData)).unwrap();
      setFormData({ name: '', description: '' });
    } catch (error) {
      console.error('Failed to create team:', error);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Create New Team
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Team Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          margin="normal"
          multiline
          rows={3}
        />
        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 2 }}
        >
          Create Team
        </Button>
      </form>
    </Paper>
  );
};

export default CreateTeamForm;
