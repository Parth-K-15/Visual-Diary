import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    IconButton,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Divider,
    CircularProgress,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    useMediaQuery,
    useTheme,
    Fade,
    Slide,
    Grow,
    Zoom
} from '@mui/material';
import {
    ArrowBack,
    Edit,
    Delete,
    Share,
    NavigateBefore,
    NavigateNext,
    Favorite,
    Bookmark,
    LocationOn,
    CalendarToday
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import ResponsiveAppBar from '../components/AppBar';

function MemoryDetail({ userData, handleLogout, navigateTo, memoryId, onBack }) {
    const [memory, setMemory] = useState(null);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentSection, setCurrentSection] = useState(0);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showShareDialog, setShowShareDialog] = useState(false);
    const [shareEmail, setShareEmail] = useState('');
    const [sharePermission, setSharePermission] = useState('viewer');
    const [canEdit, setCanEdit] = useState(false); // Changed from isOwner to canEdit
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Animation variants
    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    const scaleIn = {
        hidden: { scale: 0.9, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: { duration: 0.5, ease: "backOut" }
        }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    useEffect(() => {
        // In your fetchMemoryDetails function:
        const fetchMemoryDetails = async () => {
            try {
                setLoading(true);

                // Fetch memory with response headers
                const memoryRes = await axios.get(`http://localhost:5000/api/memories/${memoryId}`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });

                // Check both ownership and permissions from headers
                const isOwner = userData?.userId === memoryRes.data?.user_id;
                const canEdit = isOwner || memoryRes.headers['x-can-edit'] === 'true';

                setMemory(memoryRes.data);
                setCanEdit(canEdit);

                // Fetch sections
                const sectionsRes = await axios.get(`http://localhost:5000/api/memories/${memoryId}/sections`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });

                setSections(sectionsRes.data);
            } catch (err) {
                console.error('Error fetching memory:', err);
                setError(err.response?.data?.message || err.message || 'Failed to load memory details');
            } finally {
                setLoading(false);
            }
        };

        if (memoryId) {
            fetchMemoryDetails();
        }
    }, [memoryId, userData]);

    const handlePrevious = () => {
        setCurrentSection(prev => Math.max(0, prev - 1));
    };

    const handleNext = () => {
        setCurrentSection(prev => Math.min(sections.length - 1, prev + 1));
    };

    const handleDeleteMemory = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/memories/${memoryId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            navigateTo('Home');
        } catch (error) {
            console.error('Delete error:', error);
            setError(error.response?.data?.message || 'Failed to delete memory');
        }
    };

    const handleShareSubmit = async () => {
        try {
            await axios.post(
                `http://localhost:5000/api/memories/${memoryId}/share`,
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
            setShowShareDialog(false);
            setShareEmail('');
            setSharePermission('viewer');
        } catch (error) {
            console.error('Share error:', error);
            setError(error.response?.data?.message || 'Failed to share memory');
        }
    };

    if (loading) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
            }}>
                <motion.div
                    animate={{
                        rotate: 360,
                        scale: [1, 1.2, 1]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    <CircularProgress size={80} thickness={4} />
                </motion.div>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                background: 'linear-gradient(to right, #ffefba, #ffffff)'
            }}>
                <Slide direction="down" in={true} mountOnEnter unmountOnExit>
                    <Typography variant={isMobile ? "h6" : "h5"} color="error" sx={{ mb: 3, textAlign: 'center' }}>
                        {error}
                    </Typography>
                </Slide>
                <Zoom in={true} style={{ transitionDelay: '200ms' }}>
                    <Button
                        onClick={() => window.location.reload()}
                        variant="contained"
                        sx={{
                            mt: 2,
                            borderRadius: '20px',
                            padding: '10px 24px',
                            background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                            boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
                            '&:hover': {
                                transform: 'scale(1.05)',
                                transition: 'transform 0.3s'
                            }
                        }}
                    >
                        Retry
                    </Button>
                </Zoom>
            </Box>
        );
    }

    if (!memory || sections.length === 0) {
        return (
            <Box sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                background: 'linear-gradient(to right, #e0eafc, #cfdef3)'
            }}>
                <Typography variant={isMobile ? "h5" : "h4"} sx={{ mb: 3, textAlign: 'center' }}>Memory not found</Typography>
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Button
                        onClick={onBack}
                        variant="contained"
                        sx={{
                            borderRadius: '20px',
                            padding: '12px 28px',
                            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                            boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)'
                        }}
                    >
                        Back to Home
                    </Button>
                </motion.div>
            </Box>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{ background: 'linear-gradient(to bottom, #f5f7fa, #e4e8ed)' }}
        >
            <ResponsiveAppBar
                userData={userData}
                onLogout={handleLogout}
                navigateTo={navigateTo}
                currentComponent="MemoryDetail"
            />

            <Box sx={{ minHeight: '100vh', pt: isMobile ? 6 : 8 }}>
                <Box sx={{ p: { xs: 1, sm: 2, md: 4 }, maxWidth: 1400, mx: 'auto' }}>
                    {/* Header Section */}
                    <Fade in={true} timeout={800}>
                        <Box
                            component={motion.div}
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                            sx={{
                                display: 'flex',
                                flexDirection: isSmallMobile ? 'column' : 'row',
                                alignItems: isSmallMobile ? 'flex-start' : 'center',
                                mb: 3,
                                background: 'rgba(255, 255, 255, 0.8)',
                                borderRadius: '12px',
                                p: isMobile ? 2 : 3,
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                                gap: isSmallMobile ? 2 : 0
                            }}
                        >
                            <motion.div variants={fadeInUp} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <IconButton onClick={onBack} sx={{ mr: isSmallMobile ? 0 : 2 }}>
                                    <ArrowBack fontSize={isMobile ? "medium" : "large"} />
                                </IconButton>
                            </motion.div>

                            <Box sx={{ flexGrow: 1, width: isSmallMobile ? '100%' : 'auto' }}>
                                <Typography
                                    variant={isMobile ? "h4" : "h3"}
                                    component="h1"
                                    sx={{
                                        fontWeight: 700,
                                        background: 'linear-gradient(45deg, #3f51b5, #2196f3)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        textAlign: isSmallMobile ? 'center' : 'left',
                                        mb: isSmallMobile ? 1 : 0
                                    }}
                                >
                                    {memory.title}
                                </Typography>

                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: isSmallMobile ? 'column' : 'row',
                                        alignItems: isSmallMobile ? 'flex-start' : 'center',
                                        mt: 1,
                                        gap: isSmallMobile ? 1 : 3
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <CalendarToday color="primary" sx={{ mr: 1, fontSize: isMobile ? '1rem' : '1.25rem' }} />
                                        <Typography variant={isMobile ? "body2" : "subtitle1"} color="text.secondary">
                                            {new Date(memory.memory_date).toLocaleDateString('en-GB', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </Typography>
                                    </Box>

                                    {memory.location && (
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <LocationOn color="primary" sx={{ mr: 1, fontSize: isMobile ? '1rem' : '1.25rem' }} />
                                            <Typography variant={isMobile ? "body2" : "subtitle1"} color="text.secondary">
                                                {memory.location}
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            </Box>

                            {canEdit && (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        gap: 1,
                                        mt: isSmallMobile ? 2 : 0,
                                        alignSelf: isSmallMobile ? 'center' : 'auto'
                                    }}
                                >
                                    <motion.div variants={fadeInUp} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                        <IconButton
                                            onClick={() => {
                                                if (!userData) {
                                                    navigateTo('SignIn');
                                                    return;
                                                }
                                                navigateTo('EditMemory', memoryId);
                                                // setSelectedMemoryId(memoryId); // Ensure memoryId is set
                                            }}
                                            sx={{
                                                background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
                                                color: 'white',
                                                '&:hover': {
                                                    background: 'linear-gradient(45deg, #3e8e41, #7CB342)'
                                                }
                                            }}
                                        >
                                            <Edit fontSize={isMobile ? "small" : "medium"} />
                                        </IconButton>
                                    </motion.div>

                                    <motion.div variants={fadeInUp} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                        <IconButton
                                            onClick={() => setShowShareDialog(true)}
                                            sx={{
                                                background: 'linear-gradient(45deg, #2196F3, #03A9F4)',
                                                color: 'white',
                                                '&:hover': {
                                                    background: 'linear-gradient(45deg, #1976D2, #0288D1)'
                                                }
                                            }}
                                        >
                                            <Share fontSize={isMobile ? "small" : "medium"} />
                                        </IconButton>
                                    </motion.div>

                                    <motion.div variants={fadeInUp} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                        <IconButton
                                            onClick={() => setShowDeleteDialog(true)}
                                            sx={{
                                                background: 'linear-gradient(45deg, #FF5252, #FF4081)',
                                                color: 'white',
                                                '&:hover': {
                                                    background: 'linear-gradient(45deg, #D32F2F, #E91E63)'
                                                }
                                            }}
                                        >
                                            <Delete fontSize={isMobile ? "small" : "medium"} />
                                        </IconButton>
                                    </motion.div>
                                </Box>
                            )}
                        </Box>
                    </Fade>

                    {/* Main Content */}
                    <Grid
                        container
                        spacing={isMobile ? 2 : 4}
                        sx={{
                            mt: 0,
                            flexDirection: 'column'
                        }}
                    >
                        {/* Image Section */}
                        <Grid item xs={12} md={6}>
                            <Grow in={true} timeout={1000}>
                                <Card
                                    component={motion.div}
                                    variants={scaleIn}
                                    sx={{
                                        height: '100%',
                                        borderRadius: '16px',
                                        overflow: 'hidden',
                                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                                        position: 'relative'
                                    }}
                                >
                                    <AnimatePresence mode='wait'>
                                        <motion.div
                                            key={currentSection}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 1.05 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <CardMedia
                                                component="img"
                                                image={sections[currentSection].image_url}
                                                alt={`Section ${currentSection + 1}`}
                                                sx={{
                                                    height: isMobile ? 300 : 500,
                                                    objectFit: isMobile ? 'cover' : 'contain',
                                                    bgcolor: 'grey.100'
                                                }}
                                            />
                                        </motion.div>
                                    </AnimatePresence>

                                    <Box sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        width: '100%',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        px: 2,
                                        transform: 'translateY(-50%)'
                                    }}>
                                        <motion.div
                                            whileHover={{ scale: 1.2 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <IconButton
                                                onClick={handlePrevious}
                                                disabled={currentSection === 0}
                                                sx={{
                                                    bgcolor: 'rgba(255, 255, 255, 0.8)',
                                                    backdropFilter: 'blur(5px)',
                                                    '&:disabled': { opacity: 0.5 },
                                                    '&:hover': {
                                                        bgcolor: 'rgba(255, 255, 255, 0.9)'
                                                    }
                                                }}
                                            >
                                                <NavigateBefore fontSize={isMobile ? "medium" : "large"} />
                                            </IconButton>
                                        </motion.div>

                                        <motion.div
                                            whileHover={{ scale: 1.2 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <IconButton
                                                onClick={handleNext}
                                                disabled={currentSection === sections.length - 1}
                                                sx={{
                                                    bgcolor: 'rgba(255, 255, 255, 0.8)',
                                                    backdropFilter: 'blur(5px)',
                                                    '&:disabled': { opacity: 0.5 },
                                                    '&:hover': {
                                                        bgcolor: 'rgba(255, 255, 255, 0.9)'
                                                    }
                                                }}
                                            >
                                                <NavigateNext fontSize={isMobile ? "medium" : "large"} />
                                            </IconButton>
                                        </motion.div>
                                    </Box>

                                    <Box sx={{
                                        position: 'absolute',
                                        bottom: 16,
                                        left: 0,
                                        right: 0,
                                        display: 'flex',
                                        justifyContent: 'center'
                                    }}>
                                        {Array.from({ length: sections.length }).map((_, index) => (
                                            <motion.div
                                                key={index}
                                                onClick={() => setCurrentSection(index)}
                                                whileHover={{ scale: 1.3 }}
                                                whileTap={{ scale: 0.8 }}
                                                style={{
                                                    width: 10,
                                                    height: 10,
                                                    borderRadius: '50%',
                                                    backgroundColor: currentSection === index ?
                                                        theme.palette.primary.main : 'rgba(255, 255, 255, 0.5)',
                                                    margin: '0 6px',
                                                    cursor: 'pointer',
                                                    transition: 'background-color 0.3s'
                                                }}
                                            />
                                        ))}
                                    </Box>
                                </Card>
                            </Grow>
                        </Grid>

                        {/* Text Section */}
                        <Grid item xs={12} md={6}>
                            <Slide direction={isMobile ? "up" : "right"} in={true} timeout={800}>
                                <Card
                                    component={motion.div}
                                    variants={scaleIn}
                                    sx={{
                                        height: '100%',
                                        p: isMobile ? 2 : 5,
                                        borderRadius: '16px',
                                        background: 'rgba(255, 255, 255, 0.9)',
                                        backdropFilter: 'blur(10px)',
                                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        width: '100%',
                                        zIndex: 1,
                                        minHeight: isMobile ? 'auto' : '500px'
                                    }}
                                >
                                    <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                                        <Typography
                                            variant={isMobile ? "subtitle1" : "h6"}
                                            sx={{
                                                mr: 2,
                                                background: 'linear-gradient(45deg, #3f51b5, #2196f3)',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                fontWeight: 600
                                            }}
                                        >
                                            Section {currentSection + 1} of {sections.length}
                                        </Typography>
                                    </Box>

                                    {sections[currentSection].caption && (
                                        <motion.div
                                            initial={{ x: 20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            <Typography
                                                variant={isMobile ? "h5" : "h4"}
                                                gutterBottom
                                                sx={{
                                                    fontWeight: 700,
                                                    mb: 3,
                                                    color: theme.palette.text.primary
                                                }}
                                            >
                                                {sections[currentSection].caption}
                                            </Typography>
                                        </motion.div>
                                    )}

                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        <Typography
                                            variant="body1"
                                            paragraph
                                            sx={{
                                                whiteSpace: 'pre-line',
                                                fontSize: isMobile ? '1rem' : '1.1rem',
                                                lineHeight: 1.8,
                                                color: theme.palette.text.secondary
                                            }}
                                        >
                                            {sections[currentSection].description || 'No description provided.'}
                                        </Typography>
                                    </motion.div>

                                    <Box sx={{ mt: 'auto', pt: 3 }}>
                                        <Divider sx={{ mb: 2 }} />
                                        <Box sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            flexDirection: isSmallMobile ? 'column' : 'row',
                                            gap: isSmallMobile ? 2 : 0
                                        }}>
                                            <Button
                                                onClick={handlePrevious}
                                                disabled={currentSection === 0}
                                                variant="outlined"
                                                sx={{
                                                    borderRadius: '20px',
                                                    px: isSmallMobile ? 0 : 3,
                                                    py: isSmallMobile ? 1 : 'auto',
                                                    width: isSmallMobile ? '100%' : 'auto',
                                                    '&:disabled': { opacity: 0.5 }
                                                }}
                                            >
                                                Previous
                                            </Button>

                                            <Button
                                                onClick={handleNext}
                                                disabled={currentSection === sections.length - 1}
                                                variant="contained"
                                                sx={{
                                                    borderRadius: '20px',
                                                    px: isSmallMobile ? 0 : 4,
                                                    py: isSmallMobile ? 1 : 'auto',
                                                    width: isSmallMobile ? '100%' : 'auto',
                                                    background: 'linear-gradient(45deg, #3f51b5, #2196f3)',
                                                    '&:disabled': { opacity: 0.5 }
                                                }}
                                            >
                                                Next
                                            </Button>
                                        </Box>
                                    </Box>
                                </Card>
                            </Slide>
                        </Grid>
                    </Grid>
                </Box>

                {/* Delete Confirmation Dialog */}
                <Dialog
                    open={showDeleteDialog}
                    onClose={() => setShowDeleteDialog(false)}
                    PaperProps={{
                        sx: {
                            borderRadius: '16px',
                            background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                            p: 2,
                            mx: isMobile ? 1 : 3,
                            width: isMobile ? '90%' : 'auto'
                        }
                    }}
                >
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                    >
                        <DialogTitle sx={{
                            fontWeight: 700,
                            color: theme.palette.error.main,
                            textAlign: 'center'
                        }}>
                            Delete Memory
                        </DialogTitle>
                        <DialogContent>
                            <Typography variant="body1" sx={{ textAlign: 'center' }}>
                                Are you sure you want to delete <strong>"{memory.title}"</strong>?
                                <br />
                                This action cannot be undone.
                            </Typography>
                        </DialogContent>
                        <DialogActions sx={{
                            justifyContent: 'center',
                            pb: 3,
                            flexDirection: isSmallMobile ? 'column' : 'row',
                            gap: isSmallMobile ? 1 : 0
                        }}>
                            <motion.div whileHover={{ scale: 1.05 }}>
                                <Button
                                    onClick={() => setShowDeleteDialog(false)}
                                    variant="outlined"
                                    sx={{
                                        borderRadius: '20px',
                                        px: 4,
                                        mr: isSmallMobile ? 0 : 2,
                                        width: isSmallMobile ? '100%' : 'auto'
                                    }}
                                >
                                    Cancel
                                </Button>
                            </motion.div>

                            <motion.div whileHover={{ scale: 1.05 }}>
                                <Button
                                    onClick={handleDeleteMemory}
                                    variant="contained"
                                    sx={{
                                        borderRadius: '20px',
                                        px: 4,
                                        width: isSmallMobile ? '100%' : 'auto',
                                        background: 'linear-gradient(45deg, #FF5252, #FF4081)',
                                        '&:hover': {
                                            background: 'linear-gradient(45deg, #D32F2F, #E91E63)'
                                        }
                                    }}
                                >
                                    Delete
                                </Button>
                            </motion.div>
                        </DialogActions>
                    </motion.div>
                </Dialog>

                {/* Share Dialog */}
                <Dialog
                    open={showShareDialog}
                    onClose={() => setShowShareDialog(false)}
                    PaperProps={{
                        sx: {
                            borderRadius: '16px',
                            background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                            p: 3,
                            minWidth: isMobile ? '90%' : '400px',
                            mx: isMobile ? 1 : 3
                        }
                    }}
                >
                    <motion.div
                        initial={{ y: -20 }}
                        animate={{ y: 0 }}
                    >
                        <DialogTitle sx={{
                            fontWeight: 700,
                            textAlign: 'center',
                            background: 'linear-gradient(45deg, #3f51b5, #2196f3)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            Share Memory
                        </DialogTitle>
                        <DialogContent>
                            <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
                                Share <strong>"{memory.title}"</strong> with others
                            </Typography>

                            <TextField
                                select
                                label="Permission Level"
                                value={sharePermission}
                                onChange={(e) => setSharePermission(e.target.value)}
                                fullWidth
                                sx={{ mb: 3 }}
                                variant="outlined"
                                size="medium"
                            >
                                <MenuItem value="viewer">Viewer (can only view)</MenuItem>
                                <MenuItem value="editor">Editor (can edit)</MenuItem>
                            </TextField>

                            <TextField
                                label="Email Address"
                                type="email"
                                value={shareEmail}
                                onChange={(e) => setShareEmail(e.target.value)}
                                placeholder="Enter recipient's email"
                                fullWidth
                                variant="outlined"
                                size="medium"
                                sx={{ mb: 2 }}
                            />
                        </DialogContent>
                        <DialogActions sx={{
                            justifyContent: 'center',
                            pb: 3,
                            flexDirection: isSmallMobile ? 'column' : 'row',
                            gap: isSmallMobile ? 1 : 0
                        }}>
                            <motion.div whileHover={{ scale: 1.05 }}>
                                <Button
                                    onClick={() => setShowShareDialog(false)}
                                    variant="outlined"
                                    sx={{
                                        borderRadius: '20px',
                                        px: 4,
                                        mr: isSmallMobile ? 0 : 2,
                                        width: isSmallMobile ? '100%' : 'auto'
                                    }}
                                >
                                    Cancel
                                </Button>
                            </motion.div>

                            <motion.div whileHover={{ scale: 1.05 }}>
                                <Button
                                    onClick={handleShareSubmit}
                                    disabled={!shareEmail}
                                    variant="contained"
                                    sx={{
                                        borderRadius: '20px',
                                        px: 4,
                                        width: isSmallMobile ? '100%' : 'auto',
                                        background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
                                        '&:hover': {
                                            background: 'linear-gradient(45deg, #3e8e41, #7CB342)'
                                        }
                                    }}
                                >
                                    Share Memory
                                </Button>
                            </motion.div>
                        </DialogActions>
                    </motion.div>
                </Dialog>
            </Box>
        </motion.div>
    );
}

export default MemoryDetail;