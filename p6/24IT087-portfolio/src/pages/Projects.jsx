import { useEffect, useState } from 'react';
import { createTask, deleteTask, getTasks, updateTask } from '../api';
import Notification from '../components/Notification';
import ProjectCard from '../components/ProjectCard';
import Spinner from '../components/Spinner';

const projects = [
  {
    title: 'Heart Stroke Prediction',
    description: 'An AI-powered health analytics app that predicts stroke risk using patient indicators and an interactive dashboard.',
    tech: ['Python', 'Scikit-learn', 'Streamlit'],
    githubUrl: 'https://github.com',
    demoUrl: 'https://example.com',
    accent: 'teal',
  },
  {
    title: 'PriceWise Tracker',
    description: 'A modern product monitoring app that helps users track price changes and receive timely alerts.',
    tech: ['React', 'Node.js', 'MongoDB'],
    githubUrl: 'https://github.com',
    demoUrl: 'https://example.com',
    accent: 'violet',
  },
  {
    title: 'Student Management System',
    description: 'A backend-driven system for managing student records, attendance, and academic reports efficiently.',
    tech: ['Java', 'Spring Boot', 'MySQL'],
    githubUrl: 'https://github.com',
    demoUrl: 'https://example.com',
    accent: 'amber',
  },
  {
    title: 'Portfolio Studio',
    description: 'A polished portfolio website built with React and Vite for showcasing projects and professional growth.',
    tech: ['React', 'Vite', 'CSS'],
    githubUrl: 'https://github.com',
    demoUrl: 'https://example.com',
    accent: 'pink',
  },
  {
    title: 'TaskFlow Planner',
    description: 'A task management experience focused on productivity, reminders, and streamlined collaboration.',
    tech: ['JavaScript', 'Firebase', 'Tailwind'],
    githubUrl: 'https://github.com',
    demoUrl: 'https://example.com',
    accent: 'sky',
  },
  {
    title: 'InsightHub Analytics',
    description: 'A reporting dashboard that turns raw business data into clear insights through interactive visualizations.',
    tech: ['React', 'D3', 'Express'],
    githubUrl: 'https://github.com',
    demoUrl: 'https://example.com',
    accent: 'green',
  },
];

function Projects() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [operation, setOperation] = useState('');
  const [notification, setNotification] = useState(null);
  const [reloadToken, setReloadToken] = useState(0);
  const [editingTask, setEditingTask] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium', completed: false });

  useEffect(() => {
    let active = true;

    const loadTasks = async () => {
      setLoading(true);
      setLoadError('');
      try {
        const loadedTasks = await getTasks();
        if (active) setTasks(Array.isArray(loadedTasks) ? loadedTasks : []);
      } catch (err) {
        if (active) {
          setTasks([]);
          setLoadError(err.message || 'Failed to load tasks.');
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadTasks();
    return () => { active = false; };
  }, [reloadToken]);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    window.setTimeout(() => setNotification(null), 3500);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setOperation(editingTask ? 'update' : 'create');
    try {
      if (editingTask) {
        await updateTask(editingTask._id, form);
        showNotification('success', 'Task updated successfully!');
      } else {
        await createTask({ title: form.title, description: form.description, priority: form.priority });
        showNotification('success', 'Task created successfully!');
      }
      setForm({ title: '', description: '', priority: 'medium', completed: false });
      setEditingTask(null);
      setReloadToken((value) => value + 1);
    } catch (err) {
      showNotification('error', err.message || `Failed to ${editingTask ? 'update' : 'create'} task.`);
    } finally {
      setOperation('');
    }
  };

  const startEditing = (task) => {
    setEditingTask(task);
    setForm({ title: task.title, description: task.description || '', priority: task.priority, completed: task.completed });
  };

  const cancelEditing = () => {
    setEditingTask(null);
    setForm({ title: '', description: '', priority: 'medium', completed: false });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    setOperation(`delete-${id}`);
    try {
      await deleteTask(id);
      showNotification('success', 'Task deleted successfully!');
      setReloadToken((value) => value + 1);
    } catch (err) {
      showNotification('error', err.message || 'Failed to delete task.');
    } finally {
      setOperation('');
    }
  };

  return (
    <section className="page-section" aria-labelledby="projects-title">
      {/* Existing static portfolio projects from Practical 1 & 2 */}
      <div className="section-heading">
        <p className="eyebrow">Showcase</p>
        <h2 id="projects-title">Selected Projects</h2>
        <p>Each project reflects a different milestone in building smart, responsive, and user-centered applications.</p>
      </div>

      <div className="project-grid">
        {projects.map((project) => (
          <ProjectCard key={project.title} {...project} />
        ))}
      </div>

      <div className="section-card github-section">
        <div className="section-heading">
          <p className="eyebrow">Practical 6</p>
          <h3>Task Manager</h3>
          <p>Create, update, and remove tasks stored in MongoDB.</p>
        </div>

        <Notification notification={notification} />

        <form className="task-form" onSubmit={handleSubmit}>
          <label htmlFor="task-title">Title<input id="task-title" name="title" value={form.title} onChange={handleChange} required /></label>
          <label htmlFor="task-description">Description<textarea id="task-description" name="description" value={form.description} onChange={handleChange} rows="3" /></label>
          <label htmlFor="task-priority">Priority<select id="task-priority" name="priority" value={form.priority} onChange={handleChange}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label>
          {editingTask && <label className="task-checkbox"><input type="checkbox" name="completed" checked={form.completed} onChange={handleChange} /> Completed</label>}
          <div className="card-actions">
            <button className="btn btn-primary" type="submit" disabled={Boolean(operation)}>{editingTask ? 'Update Task' : 'Add Task'}</button>
            {editingTask && <button className="btn btn-secondary" type="button" onClick={cancelEditing}>Cancel</button>}
          </div>
        </form>

        {loading ? <Spinner /> : loadError ? (
          <div className="api-state api-state--error" role="alert"><p>{loadError}</p><button className="btn btn-secondary" type="button" onClick={() => setReloadToken((value) => value + 1)}>Retry</button></div>
        ) : tasks.length === 0 ? (
          <div className="api-state" role="status"><p>No tasks yet. Add your first task above.</p></div>
        ) : (
          <div className="repo-list">
            {tasks.map((task) => (
              <article key={task._id} className="repo-card task-card">
                <div className="repo-card__header"><h4>{task.title}</h4><span className={`task-priority task-priority--${task.priority}`}>{task.priority}</span></div>
                <p>{task.description || 'No description provided.'}</p>
                <div className="task-meta"><span>{task.completed ? 'Completed' : 'In progress'}</span><time dateTime={task.createdAt}>{new Date(task.createdAt).toLocaleDateString()}</time></div>
                <div className="card-actions"><button className="btn btn-secondary" type="button" onClick={() => startEditing(task)}>Edit</button><button className="btn btn-danger" type="button" disabled={operation === `delete-${task._id}`} onClick={() => handleDelete(task._id)}>Delete</button></div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Projects;
