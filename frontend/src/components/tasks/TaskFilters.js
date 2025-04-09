import React, { useState } from 'react';
import { 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  TextField
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const TaskFilters = ({ onFilterChange, teamMembers }) => {
  const [filters, setFilters] = useState({
    assignee: '',
    priority: '',
    dueDate: null,
  });

  const handleChange = (name, value) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel>Assignee</InputLabel>
        <Select
          value={filters.assignee}
          onChange={(e) => handleChange('assignee', e.target.value)}
          label="Assignee"
        >
          <MenuItem value="">All</MenuItem>
          {teamMembers.map((member) => (
            <MenuItem key={member.id} value={member.id}>
              {member.username}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel>Priority</InputLabel>
        <Select
          value={filters.priority}
          onChange={(e) => handleChange('priority', e.target.value)}
          label="Priority"
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="LOW">Low</MenuItem>
          <MenuItem value="MEDIUM">Medium</MenuItem>
          <MenuItem value="HIGH">High</MenuItem>
        </Select>
      </FormControl>
      <DatePicker
        label="Due Date"
        value={filters.dueDate}
        onChange={(date) => handleChange('dueDate', date)}
        renderInput={(params) => <TextField {...params} />}
      />
    </Box>
  );
};

export default TaskFilters;
