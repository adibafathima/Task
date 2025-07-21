// Simple API service for handling CORS issues

const API_URL = 'https://task-eight-tan-50.vercel.app';

// Authentication services
export const authService = {
  // Register a new user
  register: async (username, password) => {
    try {
      const response = await fetch(`${API_URL}/api/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        mode: 'cors',
        credentials: 'omit'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.msg || 'Registration failed');
      }
      
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  // Login user
  login: async (username, password) => {
    try {
      const response = await fetch(`${API_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        mode: 'cors',
        credentials: 'omit'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.msg || 'Login failed');
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }
};

// Task services
export const taskService = {
  // Get all tasks
  getTasks: async (token) => {
    try {
      const response = await fetch(`${API_URL}/api/tasks`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        mode: 'cors',
        credentials: 'omit'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.msg || 'Failed to get tasks');
      }
      
      return data;
    } catch (error) {
      console.error('Get tasks error:', error);
      throw error;
    }
  },
  
  // Create a new task
  createTask: async (taskData, token) => {
    try {
      const response = await fetch(`${API_URL}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(taskData),
        mode: 'cors',
        credentials: 'omit'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.msg || 'Failed to create task');
      }
      
      return data;
    } catch (error) {
      console.error('Create task error:', error);
      throw error;
    }
  }
};

export default { authService, taskService };