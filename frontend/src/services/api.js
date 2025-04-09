import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Comment out the refresh token interceptor for now
/*
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post(`${API_URL}/token/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data;
        localStorage.setItem('token', access);

        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);
*/

export const authApi = {
  login: (credentials) => api.post('/auth/login/', {
    username: credentials.username,
    password: credentials.password
  }),
  register: (userData) => api.post('/auth/register/', userData),
  refreshToken: (refresh) => api.post('/token/refresh/', { refresh }),
};

export const teamsApi = {
  getTeams: () => api.get('/teams/'),
  createTeam: (teamData) => api.post('/teams/', teamData),
  getTeam: (teamId) => api.get(`/teams/${teamId}/`),
  updateTeam: (teamId, teamData) => api.put(`/teams/${teamId}/`, teamData),
  deleteTeam: (teamId) => api.delete(`/teams/${teamId}/`),
  addMember: (teamId, userId) => api.post(`/teams/${teamId}/add_member/`, { user_id: userId }),
  removeMember: (teamId, userId) => api.post(`/teams/${teamId}/remove_member/`, { user_id: userId }),
};

export const projectsApi = {
  getProjects: () => api.get('/projects/'),
  createProject: (projectData) => api.post('/projects/', projectData),
  getProject: (projectId) => api.get(`/projects/${projectId}/`),
  updateProject: (projectId, projectData) => api.put(`/projects/${projectId}/`, projectData),
  deleteProject: (projectId) => api.delete(`/projects/${projectId}/`),
  getTeamProjects: (teamId) => api.get(`/projects/?team=${teamId}`),
};

export const tasksApi = {
  getTasks: (params = {}) => api.get('/tasks/', { params }),
  createTask: (taskData) => api.post('/tasks/', taskData),
  getTask: (taskId) => api.get(`/tasks/${taskId}/`),
  updateTask: (taskId, taskData) => api.put(`/tasks/${taskId}/`, taskData),
  deleteTask: (taskId) => api.delete(`/tasks/${taskId}/`),
  updateTaskStatus: (taskId, status) => api.patch(`/tasks/${taskId}/update_status/`, { status }),
  getProjectTasks: (projectId) => api.get(`/tasks/?project=${projectId}`),
  getAssigneeTasks: (assigneeId) => api.get(`/tasks/?assignee=${assigneeId}`),
};

export const notificationsApi = {
  getNotifications: () => api.get('/notifications/'),
  markAsRead: (notificationId) => api.post(`/notifications/${notificationId}/mark_as_read/`),
  getUnreadNotifications: () => api.get('/notifications/?is_read=false'),
};

export default api;