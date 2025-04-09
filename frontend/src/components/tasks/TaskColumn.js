import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Card, CardContent, Typography } from '@mui/material';

const TaskColumn = ({ tasks, status }) => {
  return tasks.map((task, index) => (
    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
      {(provided) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          sx={{ mb: 2 }}
        >
          <CardContent>
            <Typography variant="h6">{task.title}</Typography>
            <Typography color="textSecondary">{task.description}</Typography>
            <Typography variant="body2">
              Assignee: {task.assignee?.username || 'Unassigned'}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Draggable>
  ));
};

export default TaskColumn;
