import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, updateTaskStatus } from '../../features/tasks/tasksSlice';
import TaskColumn from './TaskColumn';
import {
  Box,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';

const KanbanBoard = () => {
  const dispatch = useDispatch();
  const { tasks, status, error } = useSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleTaskMove = async (taskId, newStatus) => {
    try {
      await dispatch(updateTaskStatus({ taskId, status: newStatus })).unwrap();
    } catch (err) {
      console.error('Failed to update task status:', err);
    }
  };

  if (status === 'loading') {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (status === 'failed') {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error || 'Failed to load tasks'}
      </Alert>
    );
  }

  const todoTasks = tasks.filter(task => task.status === 'To Do');
  const inProgressTasks = tasks.filter(task => task.status === 'In Progress');
  const doneTasks = tasks.filter(task => task.status === 'Done');

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <TaskColumn
          title="To Do"
          tasks={todoTasks}
          onTaskMove={handleTaskMove}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TaskColumn
          title="In Progress"
          tasks={inProgressTasks}
          onTaskMove={handleTaskMove}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TaskColumn
          title="Done"
          tasks={doneTasks}
          onTaskMove={handleTaskMove}
        />
      </Grid>
    </Grid>
  );
};

export default KanbanBoard;
