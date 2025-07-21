import React, { useState } from 'react';
import TaskItem from './TaskItem';
import EditTaskForm from './EditTaskForm';

const TaskList = ({ tasks, deleteTask, toggleComplete, editTask }) => {
  const [editingTask, setEditingTask] = useState(null);

  const startEditing = (task) => {
    setEditingTask(task);
  };

  const cancelEditing = () => {
    setEditingTask(null);
  };

  const saveTask = (id, updatedTask) => {
    editTask(id, updatedTask);
    setEditingTask(null);
  };

  if (!tasks || tasks.length === 0) {
    return (
      <div className="task-list">
        <p>No tasks found. Add a task to get started!</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <div key={task._id}>
          {editingTask && editingTask._id === task._id ? (
            <EditTaskForm
              task={task}
              saveTask={saveTask}
              cancelEditing={cancelEditing}
            />
          ) : (
            <TaskItem
              task={task}
              deleteTask={deleteTask}
              toggleComplete={toggleComplete}
              startEditing={startEditing}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default TaskList;