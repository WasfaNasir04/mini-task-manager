import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const teamsApi = {
  // Get all teams
  getAll: () => api.get('/teams/'),

  // Get a specific team by ID
  getOne: (id) => api.get(`/teams/${id}/`),

  // Create a new team
  create: (teamData) => api.post('/teams/', teamData),

  // Update a team
  update: (id, teamData) => api.put(`/teams/${id}/`, teamData),

  // Delete a team
  delete: (id) => api.delete(`/teams/${id}/`),

  // Add a member to a team
  addMember: (teamId, userId) => api.post(`/teams/${teamId}/add_member/`, { user_id: userId }),

  // Remove a member from a team
  removeMember: (teamId, userId) => api.post(`/teams/${teamId}/remove_member/`, { user_id: userId }),

  // Get team members
  getMembers: (teamId) => api.get(`/teams/${teamId}/members/`),
}; 