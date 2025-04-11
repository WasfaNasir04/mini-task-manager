import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createTask } from '../../features/tasks/tasksSlice';
import {
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from '@mui/material';

const CreateTaskForm = ({ onClose, projectId }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !priority) {
      setError('Please fill all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const taskData = {
        title,
        description,
        deadline,
        priority,
        project_id: projectId,
        status: 'To Do'
      };

      await dispatch(createTask(taskData)).unwrap();
      onClose();
    } catch (err) {
      console.error('Failed to create task:', err);
      setError(err.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  if (!projectId) {
    return (
      <Box p={3}>
        <Alert severity="error">Project ID is required.</Alert>
      </Box>
    );
  }

  return (
    <>
      <DialogTitle>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#026AA7' }}>
          Create New Task
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            margin="normal"
            required
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            multiline
            rows={4}
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            type="datetime-local"
            label="Deadline"
            InputLabelProps={{ shrink: true }}
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Priority</InputLabel>
            <Select
              value={priority}
              label="Priority"
              onChange={(e) => setPriority(e.target.value)}
            >
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{ backgroundColor: '#026AA7', '&:hover': { backgroundColor: '#015585' } }}
        >
          {loading ? <CircularProgress size={24} /> : 'Create Task'}
        </Button>
      </DialogActions>
    </>
  );
};

export default CreateTaskForm;
