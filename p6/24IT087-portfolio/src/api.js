const BASE_URL = 'http://localhost:5000';

async function request(endpoint, options = {}, fallbackMessage) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || fallbackMessage);
  }

  return data;
}

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