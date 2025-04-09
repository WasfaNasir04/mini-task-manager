import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createProject } from '../../features/projects/projectsSlice';
import { TextField, Button, Box, Typography, Paper } from '@mui/material';

const CreateProjectForm = ({ teamId }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    team: teamId,
  });
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createProject(formData)).unwrap();
      setFormData({ ...formData, name: '', description: '' });
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Create New Project
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Project Name"
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
          Create Project
        </Button>
      </form>
    </Paper>
  );
};

export default CreateProjectForm;
