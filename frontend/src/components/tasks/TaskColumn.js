import React from 'react';
import { Paper, Card, CardContent, Typography, Box } from '@mui/material';

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
        borderRadius: 2
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
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
            <Typography color="textSecondary" gutterBottom>
              {task.description}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="body2" color="textSecondary">
                Assignee: {task.assignee?.username || 'Unassigned'}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Paper>
  );
};

export default TaskColumn;
