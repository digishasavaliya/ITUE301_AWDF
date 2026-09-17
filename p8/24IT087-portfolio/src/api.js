const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function request(endpoint, options = {}, fallbackMessage) {
  const token = localStorage.getItem('token');

  let response;
  try {
    response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  } catch (error) {
    const message = 'Unable to connect to the backend server. Please start the API server on port 5000 and try again.';
    const connectionError = new Error(message);
    connectionError.status = 503;
    throw connectionError;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) localStorage.removeItem('token');
    const error = new Error(data.error || fallbackMessage);
    error.status = response.status;
    throw error;
  }

  return data;
}

export const registerUser = (user) => request('/register', {
  method: 'POST',
  body: JSON.stringify(user),
}, 'Registration failed.');

export const loginUser = (user) => request('/login', {
  method: 'POST',
  body: JSON.stringify(user),
}, 'Login failed.');

export const getCurrentUser = () => request('/me', {}, 'Failed to load your account.');

export const getTasks = async () => {
  const data = await request('/tasks', {}, 'Failed to fetch tasks.');
  return data.tasks;
};

export const createTask = async (task) => request('/tasks', {
  method: 'POST',
  body: JSON.stringify(task),
}, 'Failed to create task.');

export const updateTask = async (id, task) => request(`/tasks/${id}`, {
  method: 'PUT',
  body: JSON.stringify(task),
}, 'Failed to update task.');

export const deleteTask = async (id) => request(`/tasks/${id}`, {
  method: 'DELETE',
}, 'Failed to delete task.');