import React, { useState } from 'react';

function AdminTicket({ ticket, onUpdate, onViewLogs }) {
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ status: ticket.status });

  const statusOptions = ['Open', 'In Progress', 'Closed', 'Reopened'];

  const handleEdit = () => {
    setEditing(true);
    setEditForm({ status: ticket.status });
  };

  const handleSave = () => {
    onUpdate(ticket.id, editForm);
    setEditing(false);
  };

  const handleCancel = () => {
    setEditing(false);
    setEditForm({ status: ticket.status });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'status-open';
      case 'In Progress': return 'status-progress';
      case 'Closed': return 'status-closed';
      case 'Reopened': return 'status-reopened';
      default: return '';
    }
  };

  return (
    <div className="admin-ticket-card">
      <div className="ticket-header">
        <h3>{ticket.title}</h3>
        <span className={`status-badge ${getStatusColor(ticket.status)}`}>
          {ticket.status}
        </span>
      </div>
      
      <div className="ticket-content">
        <p className="ticket-description">{ticket.description}</p>
        <div className="ticket-meta">
          <span className="user-info">
            <strong>User:</strong> {ticket.user}
          </span>
          <span className="ticket-id">
            <strong>ID:</strong> #{ticket.id}
          </span>
        </div>
      </div>

      <div className="ticket-actions">
        {editing ? (
          <div className="edit-form">
            <select
              value={editForm.status}
              onChange={(e) => setEditForm({ status: e.target.value })}
              className="status-select"
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <button 
              className="btn btn-primary btn-sm" 
              onClick={handleSave}
            >
              Save
            </button>
            <button 
              className="btn btn-secondary btn-sm" 
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="action-buttons">
            <button 
              className="btn btn-primary btn-sm" 
              onClick={handleEdit}
            >
              Update Status
            </button>
            <button 
              className="btn btn-info btn-sm" 
              onClick={() => onViewLogs(ticket.id)}
            >
              View Logs
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminTicket;
