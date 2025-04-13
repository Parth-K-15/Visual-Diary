import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import ResponsiveAppBar from "../components/AppBar";
import axios from 'axios';

function Home({ userData, handleLogout }) {
    const [swiperReady, setSwiperReady] = useState(false);
    const [memories, setMemories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [memoryToDelete, setMemoryToDelete] = useState(null);
    const [showDropdown, setShowDropdown] = useState(null); // Track which card's dropdown is open
    const [showShareModal, setShowShareModal] = useState(false);
    const [memoryToShare, setMemoryToShare] = useState(null);

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
                // Remove the deleted memory from state
                setMemories(memories.filter(m => m.memory_id !== memoryToDelete.memory_id));
                setShowDeleteModal(false);
            }
        } catch (error) {
            console.error('Error deleting memory:', error);
            setError('Failed to delete memory');
        }
    };

    const handleShareClick = (memory, e) => {
        e.preventDefault();
        e.stopPropagation();
        setMemoryToShare(memory);
        setShowShareModal(true);
        setShowDropdown(null); // Close dropdown when opening share modal
    };

    useEffect(() => {
        const fetchMemories = async () => {
            try {
                setLoading(true);
                setError(null);
                console.log('Fetching memories...');
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

                // Make the actual API call
                const response = await axios.get(endpoint, config);
                console.log('API Response:', response);

                if (!response.data) {
                    throw new Error('Server returned empty response');
                }

                // Ensure response.data is an array before mapping
                const memoriesData = Array.isArray(response.data) ? response.data : [];
                console.log('Memories data:', memoriesData);

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
                const swiper = new window.Swiper('.swiper', {
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
            <div className="visual-diary-app">
                <ResponsiveAppBar userData={userData} handleLogout={handleLogout} />
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading your memories...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="visual-diary-app">
                <ResponsiveAppBar userData={userData} handleLogout={handleLogout} />
                <div className="error-container">
                    <p className="error-message">{error}</p>
                    <button
                        className="retry-button"
                        onClick={() => window.location.reload()}
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (memories.length === 0) {
        return (
            <div className="visual-diary-app">
                <ResponsiveAppBar userData={userData} handleLogout={handleLogout} />
                <div className="empty-state">
                    <h2>No memories yet</h2>
                    <p>Start by creating your first memory!</p>
                    <Link to="/create-memory" className="create-button">
                        Create Memory
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="visual-diary-app">
            <ResponsiveAppBar
                userData={userData}
                onLogout={handleLogout}
            />

            {/* Swiper container */}
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
                                    {showDropdown === memory.memory_id && (
                                        <div className="memory-options-dropdown">
                                            <button onClick={(e) => handleShareClick(memory, e)}>
                                                Share
                                            </button>
                                            {userData && userData.userId === memory.user_id && (
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        setMemoryToDelete(memory);
                                                        setShowDeleteModal(true);
                                                        setShowDropdown(null);
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    )}
                                    <Link to={`/memory/${memory.memory_id}`} className="memory-link">
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
                                                {/* {memory.username && (
                                                <span className="author">by {memory.username}</span>
                                            )} */}
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="swiper-button-prev"></div>
                <div className="swiper-button-next"></div>
            </div>

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
            {showShareModal && (
                <div className="share-modal">
                    <div className="modal-content">
                        <h3>Share Memory</h3>
                        <p>Share "{memoryToShare?.title}" with others</p>

                        <div className="share-options">
                            <div className="share-option">
                                <label>Share as:</label>
                                <select>
                                    <option value="viewer">Viewer (can only view)</option>
                                    <option value="editor">Editor (can edit)</option>
                                </select>
                            </div>

                            <div className="share-option">
                                <label>User Email:</label>
                                <input type="email" placeholder="Enter user's email" />
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button
                                className="cancel-btn"
                                onClick={() => setShowShareModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="share-btn"
                                onClick={() => {
                                    // Implement share functionality here
                                    setShowShareModal(false);
                                }}
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