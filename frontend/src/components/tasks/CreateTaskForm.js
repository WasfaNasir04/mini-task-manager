import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
} from '@mui/material';
import { teamsApi } from '../../services/teamsApi';

const CreateTaskForm = ({ onClose, projectId }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const project = useSelector(state => state.projects.projects.find(p => p.id === projectId));

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        if (project?.team?.id) {
          const response = await teamsApi.getOne(project.team.id);
          setTeamMembers(response.data.members || []);
        }
      } catch (error) {
        console.error('Error fetching team members:', error);
        setError('Failed to fetch team members');
      }
    };

    fetchTeamMembers();
  }, [project]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const taskData = {
        title,
        description,
        deadline,
        assignee_id: assigneeId,
        priority,
        project_id: projectId,
        status: 'To Do'
      };

      await dispatch(createTask(taskData)).unwrap();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  if (!project) {
    return <div>Loading project...</div>;
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="title"
        label="Task Title"
        name="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        multiline
        rows={4}
        id="description"
        label="Description"
        name="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        type="datetime-local"
        id="deadline"
        label="Deadline"
        name="deadline"
        InputLabelProps={{ shrink: true }}
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />
      <FormControl fullWidth margin="normal">
        <InputLabel id="assignee-label">Assignee</InputLabel>
        <Select
          labelId="assignee-label"
          id="assignee"
          value={assigneeId}
          label="Assignee"
          onChange={(e) => setAssigneeId(e.target.value)}
          required
        >
          {teamMembers.map((member) => (
            <MenuItem key={member.id} value={member.id}>
              {member.username} ({member.role})
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel id="priority-label">Priority</InputLabel>
        <Select
          labelId="priority-label"
          id="priority"
          value={priority}
          label="Priority"
          onChange={(e) => setPriority(e.target.value)}
          required
        >
          <MenuItem value="Low">Low</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="High">High</MenuItem>
        </Select>
      </FormControl>
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Create Task'}
        </Button>
      </Box>
    </Box>
  );
};

export default CreateTaskForm;
