import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
} from '@mui/material';
import { createProject } from '../../features/projects/projectsSlice';

const CreateProjectForm = ({ onClose, teamId }) => {
  const dispatch = useDispatch();
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!projectName.trim()) {
      setError('Project name is required');
      return;
    }

    if (!teamId) {
      setError('Team ID is required');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await dispatch(createProject({ 
        name: projectName.trim(),
        description: description.trim(),
        team_id: teamId,
      })).unwrap();
      onClose();
    } catch (err) {
      console.error('Project creation error:', err);
      setError(err.message || 'Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <DialogTitle>Create New Project</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <TextField
              autoFocus
              label="Project Name"
              fullWidth
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
              error={!!error && !projectName}
              helperText={error && !projectName ? 'Project name is required' : ''}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter project description..."
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button 
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{ backgroundColor: '#026AA7' }}
          >
            Create Project
          </Button>
        </DialogActions>
      </form>
    </>
  );
};

export default CreateProjectForm;
