import React, { useState } from 'react';

function TicketList({ tickets, onUpdate, onDelete, isAdmin }) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const statusOptions = ['Open', 'In Progress', 'Closed', 'Reopened'];

  const handleEdit = (ticket) => {
    setEditingId(ticket.id);
    setEditForm({ status: ticket.status });
  };

  const handleSave = (ticketId) => {
    onUpdate(ticketId, editForm);
    setEditingId(null);
    setEditForm({});
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
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

  if (tickets.length === 0) {
    return (
      <div className="no-tickets">
        <p>No tickets found. Create your first ticket to get started!</p>
      </div>
    );
  }

  return (
    <div className="ticket-list">
      {tickets.map(ticket => (
        <div key={ticket.id} className="ticket-card">
          <div className="ticket-header">
            <h3>{ticket.title}</h3>
            <span className={`status-badge ${getStatusColor(ticket.status)}`}>
              {ticket.status}
            </span>
          </div>
          
          <div className="ticket-content">
            <p>{ticket.description}</p>
            {ticket.attachment_url && (
              <div className="ticket-attachment">
                <a href={`http://localhost:5000${ticket.attachment_url}`} target="_blank" rel="noopener noreferrer">
                    View Attachment
                </a>
            </div>
            )}
         </div>

          <div className="ticket-actions">
            {editingId === ticket.id ? (
              <div className="edit-form">
                <select
                  value={editForm.status || ticket.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <button 
                  className="btn btn-primary btn-sm" 
                  onClick={() => handleSave(ticket.id)}
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
                  onClick={() => handleEdit(ticket)}
                >
                  Edit Status
                </button>
                <button 
                  className="btn btn-danger btn-sm" 
                  onClick={() => onDelete(ticket.id)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default TicketList;
