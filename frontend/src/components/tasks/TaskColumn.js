import React from 'react';
import { Paper, Card, CardContent, Typography, Box, Chip, List, ListItem, ListItemText } from '@mui/material';

const TaskColumn = ({ tasks, status, onTaskMove }) => {
  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      onTaskMove(parseInt(taskId), status);
    }
  };

  return (
    <Paper
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      sx={{
        p: 2,
        minHeight: 400,
        backgroundColor: '#f5f5f5',
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#026AA7' }}>
        {status}
      </Typography>
      {tasks.map((task) => (
        <Card
          key={task.id}
          draggable
          onDragStart={(e) => handleDragStart(e, task.id)}
          sx={{
            mb: 2,
            cursor: 'grab',
            '&:hover': {
              boxShadow: 3,
            },
          }}
        >
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {task.title}
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText primary="Description" secondary={task.description} />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Deadline"
                  secondary={task.deadline ? new Date(task.deadline).toLocaleString() : 'No due date'}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Priority"
                  secondary={
                    <Chip
                      label={task.priority}
                      size="small"
                      color={
                        task.priority === 'High' ? 'error' :
                        task.priority === 'Medium' ? 'warning' : 'success'
                      }
                    />
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Assignee"
                  secondary={task.assignee?.username || 'Unassigned'}
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      ))}
    </Paper>
  );
};

export default TaskColumn;
