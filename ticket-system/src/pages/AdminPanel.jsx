import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminTicket from '../components/AdminTicket';
import LogViewer from '../components/LogViewer';
import SearchBar from '../components/SearchBar';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

function AdminPanel() {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showLogs, setShowLogs] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTickets();
  }, [priorityFilter, categoryFilter]);

  const fetchTickets = async () => {
    try {
      const params = new URLSearchParams();
      if (priorityFilter !== 'all') {
        params.append('priority', priorityFilter);
      }
      if (categoryFilter !== 'all') {
        params.append('category', categoryFilter);
      }
      
      const url = `${BASE_URL}/admin/tickets${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await axios.get(url, { withCredentials: true });
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
      fetchTickets(); // Refetch with current filters
      return;
    }

    setSearchLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('query', searchTerm);
      if (priorityFilter !== 'all') {
        params.append('priority', priorityFilter);
      }
      if (categoryFilter !== 'all') {
        params.append('category', categoryFilter);
      }
      
      const response = await axios.get(`${BASE_URL}/tickets/search?${params.toString()}`, { 
        withCredentials: true 
      });
      setFilteredTickets(response.data);
    } catch (err) {
      console.error('Search failed:', err);
      setError('Search failed. Showing all tickets.');
      fetchTickets(); // Refetch with current filters
    } finally {
      setSearchLoading(false);
    }
  };

  const handleUpdateTicket = async (ticketId, updates) => {
    try {
      await axios.put(`${BASE_URL}/admin/tickets/${ticketId}`, updates, { withCredentials: true });
      fetchTickets();
    } catch (err) {
      setError('Failed to update ticket');
    }
  };

  const handleViewLogs = async (ticketId) => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/tickets/${ticketId}/logs`, { withCredentials: true });
      setSelectedTicket({ id: ticketId, logs: response.data });
      setShowLogs(true);
    } catch (err) {
      setError('Failed to fetch ticket logs');
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/logout`, {}, { withCredentials: true });
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

        <div className="filter-section" style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
          <div>
            <label>Priority: </label>
            <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
          <div>
            <label>Category: </label>
            <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="BUG">Bug</option>
              <option value="FEATURE">Feature</option>
              <option value="SERVICE">Service</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </div>

        <div className="search-section">
          <SearchBar 
            onSearch={handleSearch} 
            placeholder="Search tickets by title, description, or user..." 
            activeFilters={{ priority: priorityFilter, category: categoryFilter }}
          />
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
