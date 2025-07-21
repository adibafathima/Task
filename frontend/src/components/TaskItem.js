import React from 'react';

const TaskItem = ({ task, deleteTask, toggleComplete, startEditing }) => {
  return (
    <div className={`task ${task.completed ? 'completed' : ''}`}>
      <h3>{task.title}</h3>
      {task.description && <p>{task.description}</p>}
      <p>
        <strong>Category:</strong> {task.category}
      </p>
      <p>
        <strong>Status:</strong> {task.completed ? 'Completed' : 'Incomplete'}
      </p>
      <div className="task-actions">
        <button
          className="btn"
          onClick={() => toggleComplete(task._id)}
        >
          {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
        </button>
        <button
          className="btn"
          onClick={() => startEditing(task)}
        >
          Edit
        </button>
        <button
          className="btn btn-danger"
          onClick={() => deleteTask(task._id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskItem;