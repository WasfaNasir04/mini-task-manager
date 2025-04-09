import React, { useEffect } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, updateTaskStatus } from '../../features/tasks/tasksSlice';
import { Box, Paper, Typography } from '@mui/material';
import TaskColumn from './TaskColumn';

const statuses = ['TODO', 'IN_PROGRESS', 'DONE'];

const KanbanBoard = ({ projectId }) => {
  const dispatch = useDispatch();
  const { tasks, loading, error } = useSelector((state) => state.tasks);

  useEffect(() => {
    if (projectId) {
      dispatch(fetchTasks(projectId));
    }
  }, [dispatch, projectId]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const taskId = result.draggableId;
    const newStatus = result.destination.droppableId;
    
    dispatch(updateTaskStatus({ taskId, status: newStatus }));
  };

  if (loading) return <Typography>Loading tasks...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Box sx={{ display: 'flex', gap: 2, p: 2 }}>
        {statuses.map((status) => (
          <Droppable key={status} droppableId={status}>
            {(provided) => (
              <Paper
                {...provided.droppableProps}
                ref={provided.innerRef}
                sx={{ flex: 1, p: 2 }}
              >
                <Typography variant="h6" gutterBottom>
                  {status.replace('_', ' ')}
                </Typography>
                <TaskColumn
                  tasks={tasks.filter(task => task.status === status)}
                  status={status}
                />
                {provided.placeholder}
              </Paper>
            )}
          </Droppable>
        ))}
      </Box>
    </DragDropContext>
  );
};

export default KanbanBoard;
