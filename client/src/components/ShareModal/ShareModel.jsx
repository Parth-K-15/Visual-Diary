import { useState } from 'react';
import './ShareModal.css';

export default function ShareModal({ memory, onClose, onShare }) {
  const [email, setEmail] = useState('');
  const [canEdit, setCanEdit] = useState(false);

  return (
    <div className="share-modal">
      <div className="modal-content">
        <h3>Share Memory</h3>
        <p>Share "{memory?.title}" with others</p>
        
        <div className="share-options">
          <div className="share-option">
            <label>User Email:</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter user's email" 
            />
          </div>
          <div className="permission-toggle">
            <label>
              <input 
                type="checkbox" 
                checked={canEdit}
                onChange={(e) => setCanEdit(e.target.checked)} 
              />
              Allow editing
            </label>
          </div>
        </div>
        
        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button 
            className="share-btn" 
            onClick={() => onShare(email, canEdit)}
            disabled={!email}
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
}