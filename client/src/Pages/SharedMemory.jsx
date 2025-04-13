import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import ResponsiveAppBar from "../components/AppBar";
import axios from 'axios';

function SharedMemory({ userData, handleLogout, navigateTo, onMemoryClick }) {
    const [swiperReady, setSwiperReady] = useState(false);
    const [sharedMemories, setSharedMemories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [memoryToDelete, setMemoryToDelete] = useState(null);
    const [showDropdown, setShowDropdown] = useState(null);
    const [showShareModal, setShowShareModal] = useState(false);
    const [memoryToShare, setMemoryToShare] = useState(null);
    const [shareEmail, setShareEmail] = useState('');
    const [sharePermission, setSharePermission] = useState('viewer');
    const [permissions, setPermissions] = useState({}); // { memory_id: { canEdit: boolean } }

    const handleDeleteClick = (memory, e) => {
        e.preventDefault();
        e.stopPropagation();
        setMemoryToDelete(memory);
        setShowDeleteModal(true);
        setShowDropdown(null);
    };

    const handleDeleteMemory = async () => {
        try {
            const response = await axios.delete(
                `http://localhost:5000/api/memories/${memoryToDelete.memory_id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            if (response.status === 200) {
                setSharedMemories(sharedMemories.filter(m => m.memory_id !== memoryToDelete.memory_id));
                setShowDeleteModal(false);
            }
        } catch (error) {
            console.error('Error deleting memory:', error);
            setError(error.response?.data?.message || 'Failed to delete memory');
        }
    };

    const handleShareSubmit = async () => {
        try {
            const response = await axios.post(
                `http://localhost:5000/api/memories/${memoryToShare.memory_id}/share`,
                {
                    email: shareEmail,
                    canEdit: sharePermission === 'editor'
                },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            if (response.status === 200) {
                alert('Memory shared successfully!');
                setShowShareModal(false);
                setShareEmail('');
                setSharePermission('viewer');
            }
        } catch (error) {
            console.error('Error sharing memory:', error);
            setError(error.response?.data?.message || 'Failed to share memory');
        }
    };

    useEffect(() => {
        const fetchSharedMemories = async () => {
            try {
              setLoading(true);
              setError(null);
              
              const response = await axios.get(
                'http://localhost:5000/api/memories/shared',
                {
                  headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Accept': 'application/json'
                  }
                }
              );
          
              // Destructure the response properly
              const { memories, permissions } = response.data;
          
              const formattedMemories = memories.map(memory => ({
                ...memory,
                formattedDate: memory.formattedDate ||
                  new Date(memory.memory_date).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })
              }));
          
              setSharedMemories(formattedMemories);
              setPermissions(permissions);
            } catch (err) {
              console.error('Error fetching shared memories:', err);
              setError(err.response?.data?.message || 'Failed to load shared memories');
            } finally {
              setLoading(false);
            }
          };

        if (userData) {
            fetchSharedMemories();
        }
    }, [userData, handleLogout]);

    useEffect(() => {
        const initSwiper = () => {
            if (window.Swiper && sharedMemories.length > 0) {
                new window.Swiper('.swiper', {
                    slidesPerView: 1,
                    centeredSlides: true,
                    spaceBetween: 30,
                    loop: true,
                    effect: 'coverflow',
                    coverflowEffect: {
                        rotate: 0,
                        stretch: 0,
                        depth: 100,
                        modifier: 2.5,
                        slideShadows: false
                    },
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                    breakpoints: {
                        640: {
                            slidesPerView: 1.5,
                            spaceBetween: 20
                        },
                        1024: {
                            slidesPerView: 2.5,
                            spaceBetween: 30
                        }
                    }
                });
                return true;
            }
            return false;
        };

        if (!initSwiper()) {
            const interval = setInterval(() => {
                if (initSwiper()) {
                    clearInterval(interval);
                    setSwiperReady(true);
                }
            }, 100);
            return () => clearInterval(interval);
        } else {
            setSwiperReady(true);
        }
    }, [sharedMemories]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading shared memories...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p className="error-message">{error}</p>
                <button
                    className="retry-button"
                    onClick={() => window.location.reload()}
                >
                    Retry
                </button>
            </div>
        );
    }

    if (sharedMemories.length === 0) {
        return (
            <div className="empty-state">
                <h2>No shared memories yet</h2>
                <p>Memories shared with you will appear here</p>
            </div>
        );
    }

    return (
        <div className="visual-diary-app">
            <ResponsiveAppBar
                userData={userData}
                onLogout={handleLogout}
                navigateTo={navigateTo}
                currentComponent="Shared"
            />

            <div className="swiper-container" style={{
                height: '90vh',
                opacity: swiperReady ? 1 : 0,
                transition: 'opacity 0.5s ease'
            }}>
                <div className="swiper">
                    <div className="swiper-wrapper">
                        {sharedMemories.map((memory) => (
                            <div className="swiper-slide" key={memory.memory_id}>
                                <div className="slide-card">
                                    {/* Show options button only if user has edit permissions */}
                                    {permissions[memory.memory_id]?.canEdit && (
                                        <button
                                            className="memory-options-btn"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setShowDropdown(showDropdown === memory.memory_id ? null : memory.memory_id);
                                            }}
                                        >
                                            ⋮
                                        </button>
                                    )}

                                    {/* Dropdown menu - only show if user has edit permissions */}
                                    {showDropdown === memory.memory_id && permissions[memory.memory_id]?.canEdit && (
                                        <div className="memory-options-dropdown">
                                            <button onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setMemoryToShare(memory);
                                                setShowShareModal(true);
                                                setShowDropdown(null);
                                            }}>
                                                Share
                                            </button>
                                            <button onClick={(e) => handleDeleteClick(memory, e)}>
                                                Delete
                                            </button>
                                        </div>
                                    )}

                                    <div
                                        className="memory-link"
                                        onClick={() => onMemoryClick(memory.memory_id)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className="image-container">
                                            <img
                                                src={memory.preview_image_url}
                                                alt={memory.title}
                                                className="slide-card-img-top"
                                                onError={(e) => {
                                                    e.target.src = '/images/default-memory.jpg';
                                                }}
                                            />
                                        </div>
                                        <div className="slide-card-body">
                                            <h5>{memory.title}</h5>
                                            <div className="memory-meta">
                                                <span className="date d-block text-muted small">{memory.formattedDate}</span>
                                                <span className="shared-by d-block text-muted small">
                                                    Shared by: {memory.owner_username || 'Unknown'}
                                                </span>
                                                {permissions[memory.memory_id] && (
                                                    <span className={`permission-badge ${permissions[memory.memory_id].canEdit ? 'editor' : 'viewer'}`}>
                                                        {permissions[memory.memory_id].canEdit ? 'Editor' : 'Viewer'}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="swiper-button-prev"></div>
                <div className="swiper-button-next"></div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="delete-confirmation-modal">
                    <div className="modal-content">
                        <h3>Delete Memory</h3>
                        <p>Are you sure you want to delete "{memoryToDelete?.title}"?</p>
                        <p>This action cannot be undone.</p>
                        <div className="modal-actions">
                            <button
                                className="cancel-btn"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="delete-btn"
                                onClick={handleDeleteMemory}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Share Modal */}
            {showShareModal && (
                <div className="share-modal">
                    <div className="modal-content">
                        <h3>Share Memory</h3>
                        <p>Share "{memoryToShare?.title}" with others</p>

                        <div className="share-options">
                            <div className="share-option">
                                <label>Share as:</label>
                                <select
                                    value={sharePermission}
                                    onChange={(e) => setSharePermission(e.target.value)}
                                >
                                    <option value="viewer">Viewer (can only view)</option>
                                    <option value="editor">Editor (can edit)</option>
                                </select>
                            </div>

                            <div className="share-option">
                                <label>User Email:</label>
                                <input
                                    type="email"
                                    value={shareEmail}
                                    onChange={(e) => setShareEmail(e.target.value)}
                                    placeholder="Enter user's email"
                                />
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button
                                className="cancel-btn"
                                onClick={() => {
                                    setShowShareModal(false);
                                    setShareEmail('');
                                    setSharePermission('viewer');
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="share-btn"
                                onClick={handleShareSubmit}
                                disabled={!shareEmail}
                            >
                                Share
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SharedMemory;