import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { inviteMember } from '../../features/teams/teamsSlice';
import { TextField, Button, Box, Typography, Paper } from '@mui/material';

const InviteMemberForm = ({ teamId }) => {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(inviteMember({ teamId, email })).unwrap();
      setEmail('');
    } catch (error) {
      console.error('Failed to invite member:', error);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Invite Team Member
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
          required
        />
        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 2 }}
        >
          Invite
        </Button>
      </form>
    </Paper>
  );
};

export default InviteMemberForm;
