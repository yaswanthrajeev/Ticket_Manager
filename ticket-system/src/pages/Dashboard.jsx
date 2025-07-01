import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TicketForm from '../components/TicketForm';
import TicketList from '../components/TicketList';
import SearchBar from '../components/SearchBar';

function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tickets', { withCredentials: true });
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
      const response = await axios.get(`http://localhost:5000/tickets/search?query=${encodeURIComponent(searchTerm)}`, { 
        withCredentials: true 
      });
      setFilteredTickets(response.data);
    } catch (err) {
      console.error('Search failed:', err);
      setError('Search failed. Showing all tickets.');
      setFilteredTickets(tickets);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleCreateTicket = async (ticketData) => {
    try {
      await axios.post('http://localhost:5000/tickets', ticketData, { withCredentials: true , 
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setShowForm(false);
      fetchTickets();
    } catch (err) {
      setError('Failed to create ticket');
    }
  };

  const handleUpdateTicket = async (ticketId, updates) => {
    try {
      await axios.put(`http://localhost:5000/tickets/${ticketId}`, updates, { withCredentials: true });
      fetchTickets();
    } catch (err) {
      setError('Failed to update ticket');
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      try {
        await axios.delete(`http://localhost:5000/tickets/${ticketId}`, { withCredentials: true });
        fetchTickets();
      } catch (err) {
        setError('Failed to delete ticket');
      }
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
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="container">
          <h1>My Tickets</h1>
          <div className="header-actions">
            <button 
              className="btn btn-primary" 
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? 'Cancel' : 'Create New Ticket'}
            </button>
            <button className="btn btn-secondary" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container">
        {error && <div className="error-message">{error}</div>}

        {showForm && (
          <TicketForm onSubmit={handleCreateTicket} onCancel={() => setShowForm(false)} />
        )}

        <div className="search-section">
          <SearchBar onSearch={handleSearch} placeholder="Search tickets by title..." />
          {searchLoading && <div className="search-loading">Searching...</div>}
        </div>

        <TicketList 
          tickets={filteredTickets}
          onUpdate={handleUpdateTicket}
          onDelete={handleDeleteTicket}
          isAdmin={false}
        />

        {filteredTickets.length === 0 && !searchLoading && (
          <div className="no-tickets">
            <p>No tickets found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
