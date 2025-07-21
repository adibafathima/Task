import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import Auth from './components/Auth';

// Set base URL for axios
const API_URL = process.env.REACT_APP_API_URL || '';
axios.defaults.baseURL = API_URL;

function App() {
  const [tasks, setTasks] = useState({});
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [filter, setFilter] = useState('All');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated
  useEffect(() => {
    // On first load, clear any existing token
    if (!localStorage.getItem('firstLoad')) {
      localStorage.setItem('firstLoad', 'true');
      localStorage.removeItem('token');
      setToken(null);
      setIsAuthenticated(false);
    } else if (token) {
      setAuthToken(token);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, [token]);

  // Set auth token for axios
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['x-auth-token'];
      localStorage.removeItem('token');
    }
  };

  // Login user
  const login = async (userData) => {
    try {
      console.log('Logging in with:', userData);
      const res = await axios.post('/api/users/login', userData);
      console.log('Login response:', res.data);
      const token = res.data.token;
      setAuthToken(token);
      setToken(token);
      setIsAuthenticated(true);
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      return err.response?.data || { msg: 'Login failed' };
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      console.log('Registering with:', userData);
      const res = await axios.post('/api/users/register', userData);
      console.log('Register response:', res.data);
      const token = res.data.token;
      setAuthToken(token);
      setToken(token);
      setIsAuthenticated(true);
    } catch (err) {
      console.error('Register error:', err.response?.data || err.message);
      return err.response?.data || { msg: 'Registration failed' };
    }
  };

  // Logout user
  const logout = () => {
    setToken(null);
    setIsAuthenticated(false);
    setTasks({});
    setFilteredTasks([]);
  };

  // Get tasks
  const getTasks = async () => {
    try {
      const res = await axios.get('/api/tasks');
      // Convert array to object with _id as key
      const tasksObj = {};
      res.data.forEach(task => {
        tasksObj[task._id] = task;
      });
      setTasks(tasksObj);
      filterTasks(tasksObj, filter);
    } catch (err) {
      console.error(err);
    }
  };

  // Add task
  const addTask = async (task) => {
    try {
      console.log('Adding task:', task);
      const res = await axios.post('/api/tasks', task);
      console.log('Server response:', res.data);
      const newTask = res.data;
      const updatedTasks = { ...tasks, [newTask._id]: newTask };
      console.log('Updated tasks:', updatedTasks);
      setTasks(updatedTasks);
      filterTasks(updatedTasks, filter);
    } catch (err) {
      console.error('Error adding task:', err);
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`/api/tasks/${id}`);
      const updatedTasks = { ...tasks };
      delete updatedTasks[id];
      setTasks(updatedTasks);
      filterTasks(updatedTasks, filter);
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle task completion
  const toggleComplete = async (id) => {
    try {
      const task = tasks[id];
      const updatedTask = { ...task, completed: !task.completed };
      const res = await axios.put(`/api/tasks/${id}`, updatedTask);
      const updatedTasks = { ...tasks, [id]: res.data };
      setTasks(updatedTasks);
      filterTasks(updatedTasks, filter);
    } catch (err) {
      console.error(err);
    }
  };

  // Edit task
  const editTask = async (id, updatedTask) => {
    try {
      const res = await axios.put(`/api/tasks/${id}`, updatedTask);
      const updatedTasks = { ...tasks, [id]: res.data };
      setTasks(updatedTasks);
      filterTasks(updatedTasks, filter);
    } catch (err) {
      console.error(err);
    }
  };

  // Filter tasks
  const filterTasks = (tasksObj, filterValue) => {
    console.log('Filtering tasks:', tasksObj, 'with filter:', filterValue);
    const tasksArray = Object.values(tasksObj);
    console.log('Tasks array:', tasksArray);
    
    let filtered;
    switch (filterValue) {
      case 'Completed':
        filtered = tasksArray.filter(task => task.completed);
        break;
      case 'Incomplete':
        filtered = tasksArray.filter(task => !task.completed);
        break;
      case 'Work':
        filtered = tasksArray.filter(task => task.category === 'Work');
        break;
      case 'Personal':
        filtered = tasksArray.filter(task => task.category === 'Personal');
        break;
      case 'Study':
        filtered = tasksArray.filter(task => task.category === 'Study');
        break;
      case 'Other':
        filtered = tasksArray.filter(task => task.category === 'Other');
        break;
      default:
        filtered = tasksArray;
    }
    
    console.log('Filtered tasks:', filtered);
    setFilteredTasks(filtered);
  };

  // Change filter
  const changeFilter = (newFilter) => {
    setFilter(newFilter);
    filterTasks(tasks, newFilter);
  };

  // Print task list
  const printTasks = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Task List</title>');
    printWindow.document.write('<style>body { font-family: Arial; }');
    printWindow.document.write('table { width: 100%; border-collapse: collapse; }');
    printWindow.document.write('th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }');
    printWindow.document.write('th { background-color: #f2f2f2; }');
    printWindow.document.write('</style></head><body>');
    printWindow.document.write('<h1>Task List</h1>');
    printWindow.document.write('<table>');
    printWindow.document.write('<tr><th>Title</th><th>Description</th><th>Category</th><th>Status</th></tr>');
    
    filteredTasks.forEach(task => {
      printWindow.document.write('<tr>');
      printWindow.document.write(`<td>${task.title}</td>`);
      printWindow.document.write(`<td>${task.description || ''}</td>`);
      printWindow.document.write(`<td>${task.category}</td>`);
      printWindow.document.write(`<td>${task.completed ? 'Completed' : 'Incomplete'}</td>`);
      printWindow.document.write('</tr>');
    });
    
    printWindow.document.write('</table>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  // Load tasks when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      getTasks();
    }
  }, [isAuthenticated]);

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <header className="header">
        <h1>Task Management App</h1>
        {isAuthenticated && (
          <button className="btn" onClick={logout}>
            Logout
          </button>
        )}
      </header>

      {!isAuthenticated ? (
        <Auth login={login} register={register} />
      ) : (
        <>
          <TaskForm addTask={addTask} />
          
          <div className="filter-container">
            <button
              className={`btn filter-btn ${filter === 'All' ? 'btn-active' : ''}`}
              onClick={() => changeFilter('All')}
            >
              All
            </button>
            <button
              className={`btn filter-btn ${filter === 'Completed' ? 'btn-active' : ''}`}
              onClick={() => changeFilter('Completed')}
            >
              Completed
            </button>
            <button
              className={`btn filter-btn ${filter === 'Incomplete' ? 'btn-active' : ''}`}
              onClick={() => changeFilter('Incomplete')}
            >
              Incomplete
            </button>
            <button
              className={`btn filter-btn ${filter === 'Work' ? 'btn-active' : ''}`}
              onClick={() => changeFilter('Work')}
            >
              Work
            </button>
            <button
              className={`btn filter-btn ${filter === 'Personal' ? 'btn-active' : ''}`}
              onClick={() => changeFilter('Personal')}
            >
              Personal
            </button>
            <button
              className={`btn filter-btn ${filter === 'Study' ? 'btn-active' : ''}`}
              onClick={() => changeFilter('Study')}
            >
              Study
            </button>
            <button
              className={`btn filter-btn ${filter === 'Other' ? 'btn-active' : ''}`}
              onClick={() => changeFilter('Other')}
            >
              Other
            </button>
          </div>
          
          <button className="btn" onClick={printTasks}>
            Print Tasks
          </button>
          
          <TaskList
            tasks={filteredTasks}
            deleteTask={deleteTask}
            toggleComplete={toggleComplete}
            editTask={editTask}
          />
        </>
      )}
    </div>
  );
}

export default App;