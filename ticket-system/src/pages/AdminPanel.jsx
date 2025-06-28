import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminTicket from '../components/AdminTicket';
import LogViewer from '../components/LogViewer';
import SearchBar from '../components/SearchBar';

function AdminPanel() {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showLogs, setShowLogs] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await axios.get('http://localhost:5000/admin/tickets', { withCredentials: true });
      setTickets(response.data);
      setFilteredTickets(response.data);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError('Failed to fetch tickets');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredTickets(tickets);
      return;
    }

    setSearchLoading(true);
    try {
      // For admin search, we'll filter locally since we have all tickets
      const filtered = tickets.filter(ticket => 
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.user.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTickets(filtered);
    } catch (err) {
      console.error('Search failed:', err);
      setError('Search failed. Showing all tickets.');
      setFilteredTickets(tickets);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleUpdateTicket = async (ticketId, updates) => {
    try {
      await axios.put(`http://localhost:5000/admin/tickets/${ticketId}`, updates, { withCredentials: true });
      fetchTickets();
    } catch (err) {
      setError('Failed to update ticket');
    }
  };

  const handleViewLogs = async (ticketId) => {
    try {
      const response = await axios.get(`http://localhost:5000/admin/tickets/${ticketId}/logs`, { withCredentials: true });
      setSelectedTicket({ id: ticketId, logs: response.data });
      setShowLogs(true);
    } catch (err) {
      setError('Failed to fetch ticket logs');
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/logout', {}, { withCredentials: true });
      navigate('/login');
    } catch (err) {
      navigate('/login');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="admin-panel">
      <header className="admin-header">
        <div className="container">
          <h1>Admin Panel - All Tickets</h1>
          <div className="header-actions">
            <button className="btn btn-secondary" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container">
        {error && <div className="error-message">{error}</div>}

        {showLogs && selectedTicket && (
          <LogViewer 
            ticketId={selectedTicket.id}
            logs={selectedTicket.logs}
            onClose={() => {
              setShowLogs(false);
              setSelectedTicket(null);
            }}
          />
        )}

        <div className="search-section">
          <SearchBar onSearch={handleSearch} placeholder="Search tickets by title, description, or user..." />
          {searchLoading && <div className="search-loading">Searching...</div>}
        </div>

        <div className="tickets-grid">
          {filteredTickets.map(ticket => (
            <AdminTicket
              key={ticket.id}
              ticket={ticket}
              onUpdate={handleUpdateTicket}
              onViewLogs={handleViewLogs}
            />
          ))}
        </div>

        {filteredTickets.length === 0 && !searchLoading && (
          <div className="no-tickets">
            <p>No tickets found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;
