import React, { useState } from 'react';

function TicketForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({ title: '', description: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.title.trim() && form.description.trim()) {
      onSubmit(form);
      setForm({ title: '', description: '' });
    }
  };

  return (
    <div className="ticket-form-container">
      <form className="ticket-form" onSubmit={handleSubmit}>
        <h3>Create New Ticket</h3>
        
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

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Create Ticket
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
