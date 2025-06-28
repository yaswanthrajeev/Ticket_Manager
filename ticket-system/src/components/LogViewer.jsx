import React from 'react';

function LogViewer({ ticketId, logs, onClose }) {
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="log-viewer-overlay" onClick={onClose}>
      <div className="log-viewer-modal" onClick={(e) => e.stopPropagation()}>
        <div className="log-viewer-header">
          <h3>Ticket #{ticketId} - Activity Logs</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className="log-viewer-content">
          {logs.length === 0 ? (
            <p className="no-logs">No activity logs found for this ticket.</p>
          ) : (
            <div className="logs-list">
              {logs.map((log, index) => (
                <div key={index} className="log-entry">
                  <div className="log-action">
                    {log.action}
                  </div>
                  <div className="log-timestamp">
                    {formatTimestamp(log.timestamp)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="log-viewer-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogViewer;
