import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import ResponsiveAppBar from "../components/AppBar";
import axios from 'axios';

function Home({ userData, handleLogout, navigateTo, onMemoryClick }) {
    const [swiperReady, setSwiperReady] = useState(false);
    const [memories, setMemories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [memoryToDelete, setMemoryToDelete] = useState(null);
    const [showDropdown, setShowDropdown] = useState(null);
    const [showShareModal, setShowShareModal] = useState(false);
    const [memoryToShare, setMemoryToShare] = useState(null);
    const [shareEmail, setShareEmail] = useState('');
    const [sharePermission, setSharePermission] = useState('viewer');

    const handleDeleteClick = (memory, e) => {
        e.preventDefault();
        e.stopPropagation();
        setMemoryToDelete(memory);
        setShowDeleteModal(true);
        setShowDropdown(null); // Close dropdown when opening delete modal
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
                setMemories(memories.filter(m => m.memory_id !== memoryToDelete.memory_id));
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
        const fetchMemories = async () => {
            try {
                setLoading(true);
                setError(null);
                const backendBaseUrl = 'http://localhost:5000';
                const endpoint = userData
                    ? `${backendBaseUrl}/api/memories`
                    : `${backendBaseUrl}/api/memories/public`;

                const config = {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Accept': 'application/json'
                    }
                };

                const response = await axios.get(endpoint, config);
                const memoriesData = Array.isArray(response.data) ? response.data : [];

                const formattedMemories = memoriesData.map(memory => ({
                    ...memory,
                    formattedDate: memory.formattedDate ||
                        new Date(memory.memory_date).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                        })
                }));

                setMemories(formattedMemories);
            } catch (err) {
                console.error('Error fetching memories:', err);
                setError(err.response?.data?.message || err.message || 'Failed to load memories');
                if (err.response?.status === 401) {
                    handleLogout();
                }
            } finally {
                setLoading(false);
            }
        };

        fetchMemories();
    }, [userData, handleLogout]);

    useEffect(() => {
        const initSwiper = () => {
            if (window.Swiper && memories.length > 0) {
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
    }, [memories]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading your memories...</p>
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

    if (memories.length === 0) {
        return (
            <div className="visual-diary-app">
                <ResponsiveAppBar
                    userData={userData}
                    onLogout={handleLogout}
                    navigateTo={navigateTo}
                    currentComponent="Home"
                />

                <div className="empty-state-container">
                    <div className="empty-state-content">
                        <div className="empty-state-illustration">
                            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                                <path fill="#F0F4FF" d="M40,-58.2C52.1,-48.9,62.4,-38.4,68.7,-25.6C75,-12.8,77.4,2.3,73.5,15.3C69.6,28.3,59.5,39.2,47.1,49.1C34.7,59,20,67.9,2.5,65.1C-15,62.3,-30,47.8,-42.6,35.1C-55.2,22.4,-65.4,11.6,-67.2,-1.1C-69,-13.8,-62.5,-27.6,-52.2,-39.2C-41.9,-50.8,-27.8,-60.3,-12.8,-66.2C2.2,-72.1,17.1,-74.4,27.5,-68.8C37.9,-63.2,43.7,-49.7,51.1,-37.2C58.5,-24.7,67.5,-13.3,69.3,-0.7C71.1,11.9,65.7,23.8,57.3,34.5C48.9,45.2,37.5,54.7,24.7,61.8C11.9,68.9,-2.3,73.6,-15.2,71.3C-28.1,69,-39.7,59.7,-50.2,49.1C-60.7,38.5,-70.1,26.6,-74.1,13.1C-78.1,-0.4,-76.7,-15.4,-68.9,-27.3C-61.1,-39.2,-46.9,-48,-34.1,-58.1C-21.4,-68.2,-10.7,-79.6,1.9,-82.7C14.5,-85.8,29,-80.6,40,-58.2Z" transform="translate(100 100)" />
                            </svg>
                            <img src="/images/empty-state.png" alt="No memories" className="empty-state-image" />
                        </div>
                        <h2 className="empty-state-title">Your Memory Journey Begins Here</h2>
                        <p className="empty-state-message">Capture life's precious moments and create your first visual memory</p>
                        <button
                            className="create-memory-button"
                            onClick={() => onMemoryClick('create')}
                        >
                            <svg className="plus-icon" viewBox="0 0 24 24">
                                <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            Create Your First Memory
                        </button>
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div className="visual-diary-app">
            <ResponsiveAppBar
                userData={userData}
                onLogout={handleLogout}
                navigateTo={navigateTo}
                currentComponent="Home"
            />

            <div className="swiper-container" style={{
                height: '90vh',
                opacity: swiperReady ? 1 : 0,
                transition: 'opacity 0.5s ease'
            }}>
                <div className="swiper">
                    <div className="swiper-wrapper">
                        {memories.map((memory) => (
                            <div className="swiper-slide" key={memory.memory_id}>
                                <div className="slide-card">
                                    {/* Options button */}
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

                                    {/* Dropdown menu */}
                                    {showDropdown === memory.memory_id && (
                                        <div className="memory-options-dropdown">
                                            <button onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                navigateTo('EditMemory', memory.memory_id);
                                                setShowDropdown(null);
                                            }}>
                                                Edit
                                            </button>
                                            <button onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setMemoryToShare(memory);
                                                setShowShareModal(true);
                                                setShowDropdown(null);
                                            }}>
                                                Share
                                            </button>
                                            {userData && userData.userId === memory.user_id && (
                                                <button onClick={(e) => handleDeleteClick(memory, e)}>
                                                    Delete
                                                </button>
                                            )}
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

export default Home;