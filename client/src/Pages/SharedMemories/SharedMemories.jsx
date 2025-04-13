import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ResponsiveAppBar from "../../components/AppBar";
import './SharedMemories.css';

export default function SharedMemories({ userData, handleLogout }) {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSharedMemories = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/api/memories/shared',
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        setMemories(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load shared memories');
      } finally {
        setLoading(false);
      }
    };

    if (userData) fetchSharedMemories();
  }, [userData]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="shared-memories-page">
      <ResponsiveAppBar userData={userData} onLogout={handleLogout} />
      
      <div className="shared-memories-container">
        <h2>Memories Shared With You</h2>
        
        {memories.length === 0 ? (
          <p>No memories have been shared with you yet.</p>
        ) : (
          <div className="memories-grid">
            {memories.map(memory => (
              <div key={memory.memory_id} className="memory-card">
                <Link to={`/memory/${memory.memory_id}`}>
                  <img 
                    src={memory.preview_image_url} 
                    alt={memory.title}
                    onError={(e) => e.target.src = '/images/default-memory.jpg'}
                  />
                  <h3>{memory.title}</h3>
                  <p>Shared by: {memory.owner_username}</p>
                  <p>Permission: {memory.can_edit ? 'Editor' : 'Viewer'}</p>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}