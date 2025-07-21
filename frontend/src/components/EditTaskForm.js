import React, { useState } from 'react';

const EditTaskForm = ({ task, saveTask, cancelEditing }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [category, setCategory] = useState(task.category);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      return;
    }
    
    saveTask(task._id, {
      title,
      description,
      category
    });
  };

  return (
    <div className="form-container">
      <h2>Edit Task</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="edit-title">Title</label>
          <input
            type="text"
            id="edit-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="edit-description">Description</label>
          <textarea
            id="edit-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="edit-category">Category</label>
          <select
            id="edit-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Study">Study</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <button type="submit" className="btn">
          Save
        </button>
        <button type="button" className="btn" onClick={cancelEditing}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditTaskForm;