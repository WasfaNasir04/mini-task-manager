import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTask } from '../../features/tasks/tasksSlice';
import { fetchProjects } from '../../features/projects/projectsSlice';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  CircularProgress
} from '@mui/material';

const CreateTaskForm = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    assigned_to: '',
    project: '',
    due_date: null,
  });

  // Get projects from Redux store
  const { items: projects, status: projectsStatus } = useSelector((state) => state.projects);

  // Initialize projects if not already loaded
  useEffect(() => {
    if (projectsStatus === 'idle') {
      dispatch(fetchProjects());
    }
  }, [projectsStatus, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createTask(formData));
    setFormData({
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      assigned_to: '',
      project: '',
      due_date: null,
    });
  };

  if (projectsStatus === 'loading') {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <TextField
        fullWidth
        label="Title"
        name="title"
        value={formData.title}
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
        rows={4}
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>Status</InputLabel>
        <Select
          name="status"
          value={formData.status}
          onChange={handleChange}
          label="Status"
        >
          <MenuItem value="todo">To Do</MenuItem>
          <MenuItem value="in_progress">In Progress</MenuItem>
          <MenuItem value="done">Done</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel>Priority</InputLabel>
        <Select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          label="Priority"
        >
          <MenuItem value="low">Low</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="high">High</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel>Project</InputLabel>
        <Select
          name="project"
          value={formData.project}
          onChange={handleChange}
          label="Project"
        >
          {projects && projects.map((project) => (
            <MenuItem key={project.id} value={project.id}>
              {project.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        fullWidth
        label="Due Date"
        type="datetime-local"
        name="due_date"
        value={formData.due_date}
        onChange={handleChange}
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
      />
      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
      >
        Create Task
      </Button>
    </Box>
  );
};

export default CreateTaskForm;
