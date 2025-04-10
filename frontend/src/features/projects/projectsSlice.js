import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { projectsApi } from '../../services/api';

export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await projectsApi.getAll();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch projects');
    }
  }
);

export const createProject = createAsyncThunk(
  'projects/createProject',
  async (projectData, { rejectWithValue }) => {
    try {
      const response = await projectsApi.create(projectData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create project');
    }
  }
);

export const assignProjectMember = createAsyncThunk(
  'projects/assignMember',
  async ({ projectId, userId }, { rejectWithValue }) => {
    try {
      const response = await projectsApi.assignMember(projectId, userId);
      return { projectId, userId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to assign member');
    }
  }
);

const projectsSlice = createSlice({
  name: 'projects',
  initialState: {
    projects: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.push(action.payload);
      })
      .addCase(assignProjectMember.fulfilled, (state, action) => {
        const project = state.projects.find(p => p.id === action.payload.projectId);
        if (project && action.payload.user) {
          project.assigned_members.push(action.payload.user);
        }
      });
  },
});

export const { clearError } = projectsSlice.actions;
export default projectsSlice.reducer;
