import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { teamsApi } from '../../services/api';

export const fetchTeams = createAsyncThunk(
  'teams/fetchTeams',
  async () => {
    const response = await teamsApi.getAll();
    return response.data;
  }
);

export const createTeam = createAsyncThunk(
  'teams/createTeam',
  async (teamData, { rejectWithValue }) => {
    try {
      console.log('Creating team with data:', teamData);
      const token = localStorage.getItem('access_token');
      console.log('Current access token:', token);
      const response = await teamsApi.create(teamData);
      console.log('Team creation response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating team:', error.response?.data || error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const inviteMember = createAsyncThunk(
  'teams/inviteMember',
  async ({ teamId, email }, { rejectWithValue }) => {
    try {
      const response = await teamsApi.addMember(teamId, email);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  items: [],
  status: 'idle',
  error: null,
};

const teamsSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {
    setCurrentTeam: (state, action) => {
      state.currentTeam = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeams.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTeams.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchTeams.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTeam.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCurrentTeam, clearError } = teamsSlice.actions;
export default teamsSlice.reducer;
