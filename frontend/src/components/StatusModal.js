import React from 'react';
import ReactDOM from 'react-dom';
import '../assets/StatusModal.css';

const StatusModal = ({ status, message }) => {
  if (!status) return null;

  return ReactDOM.createPortal(
    <div className={`status-modal ${status}`}>
      <div className="status-modal-content">
        <div className="status-icon">
          {status === 'success' ? (
            <i className="bi bi-check-circle"></i> 
          ) : (
            <i className="bi bi-x-circle"></i>
          )}
        </div>
        <p>{message}</p>
      </div>
    </div>,
    document.body
  );
};

export default StatusModal;
