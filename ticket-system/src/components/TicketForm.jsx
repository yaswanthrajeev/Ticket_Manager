import React, { useState } from 'react';

function TicketForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({ title: '', description: '', priority: 'MEDIUM', category: 'OTHER' });
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('priority', form.priority);
    formData.append('category', form.category);
    if (file) formData.append('attachment', file);
    onSubmit(formData);
    setForm({ title: '', description: '', priority: 'MEDIUM', category: 'OTHER' });
    setFile(null);
  };

  return (
    <div className="ticket-form-container">
      <form className="ticket-form" onSubmit={handleSubmit}>
        <h3>Create New Ticket</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter ticket title"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe your issue or request"
              rows="4"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select id="priority" name="priority" value={form.priority} onChange={handleChange} required>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select id="category" name="category" value={form.category} onChange={handleChange} required>
              <option value="BUG">Bug</option>
              <option value="FEATURE">Feature</option>
              <option value="SERVICE">Service</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="attachment">Attachment</label>
            <div className="file-input-wrapper">
              <input 
                type="file" 
                id="attachment"
                name="attachment" 
                onChange={handleFileChange}
                className="file-input"
              />
              <div className="file-input-label">
                {file ? file.name : 'Choose a file or drag it here'}
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            ✨ Create Ticket
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default TicketForm;
