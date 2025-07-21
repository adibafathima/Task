import React, { useState, useEffect } from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import Auth from './components/Auth';
import { authService, taskService } from './services/api';

// API URL for reference
const API_URL = 'https://task-eight-tan-50.vercel.app';

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

  // Set auth token
  const setAuthToken = (token) => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  };

  // Login user
  const login = async (userData) => {
    try {
      console.log('Logging in with:', userData);
      
      // If token is already provided (from direct API call)
      if (userData.token) {
        console.log('Using provided token');
        setAuthToken(userData.token);
        setToken(userData.token);
        setIsAuthenticated(true);
        return null;
      }
      
      // Otherwise make the API call
      const data = await authService.login(userData.username, userData.password);
      console.log('Login response:', data);
      const token = data.token;
      setAuthToken(token);
      setToken(token);
      setIsAuthenticated(true);
      return null;
    } catch (err) {
      console.error('Login error:', err.message);
      return { msg: 'Login failed' };
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      console.log('Registering with:', userData);
      
      // If token is already provided (from direct API call)
      if (userData.token) {
        console.log('Using provided token');
        setAuthToken(userData.token);
        setToken(userData.token);
        setIsAuthenticated(true);
        return null;
      }
      
      // Otherwise make the API call
      const data = await authService.register(userData.username, userData.password);
      
      console.log('Register response:', data);
      if (data && data.token) {
        const token = data.token;
        setAuthToken(token);
        setToken(token);
        setIsAuthenticated(true);
        return null; // No error
      } else {
        console.error('No token received in registration response');
        return { msg: 'Registration failed - no token received' };
      }
    } catch (err) {
      console.error('Register error:', err);
      return { msg: 'Registration failed - ' + err.message };
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
      const data = await taskService.getTasks(token);
      // Convert array to object with _id as key
      const tasksObj = {};
      data.forEach(task => {
        tasksObj[task._id] = task;
      });
      setTasks(tasksObj);
      filterTasks(tasksObj, filter);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  // Add task
  const addTask = async (task) => {
    try {
      console.log('Adding task:', task);
      const newTask = await taskService.createTask(task, token);
      console.log('Server response:', newTask);
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
      await taskService.deleteTask(id, token);
      const updatedTasks = { ...tasks };
      delete updatedTasks[id];
      setTasks(updatedTasks);
      filterTasks(updatedTasks, filter);
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  // Toggle task completion
  const toggleComplete = async (id) => {
    try {
      const task = tasks[id];
      const updatedTask = { ...task, completed: !task.completed };
      const updatedTaskData = await taskService.updateTask(id, updatedTask, token);
      const updatedTasks = { ...tasks, [id]: updatedTaskData };
      setTasks(updatedTasks);
      filterTasks(updatedTasks, filter);
    } catch (err) {
      console.error('Error toggling task completion:', err);
    }
  };

  // Edit task
  const editTask = async (id, updatedTask) => {
    try {
      const updatedTaskData = await taskService.updateTask(id, updatedTask, token);
      const updatedTasks = { ...tasks, [id]: updatedTaskData };
      setTasks(updatedTasks);
      filterTasks(updatedTasks, filter);
    } catch (err) {
      console.error('Error editing task:', err);
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