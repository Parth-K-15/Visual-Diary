import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    Grid,
    TextField,
    Typography,
    IconButton,
    CircularProgress,
    Snackbar,
    Alert,
    Fade,
    Slide,
    Grow,
    Zoom,
    Avatar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import {
    AddCircleOutline as AddCircleOutlineIcon,
    CloudUpload as CloudUploadIcon,
    Mic as MicIcon,
    Delete as DeleteIcon,
    PhotoCamera as PhotoCameraIcon,
    Description as DescriptionIcon,
    Save as SaveIcon,
    ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ResponsiveAppBar from "../components/AppBar";
import { styled } from '@mui/material/styles';
import axios from 'axios';

const StyledCard = styled(Card)(({ theme }) => ({
    width: '95%',
    maxWidth: 900,
    boxShadow: theme.shadows[10],
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    borderRadius: 16,
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: theme.shadows[12]
    }
}));

const SectionContainer = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(4),
    padding: theme.spacing(3),
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(5px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.3s ease',
    '&:hover': {
        boxShadow: '0 8px 15px rgba(0, 0, 0, 0.1)'
    }
}));

const UploadButton = styled(Button)(({ theme }) => ({
    height: 200,
    border: '2px dashed',
    borderColor: theme.palette.primary.main,
    borderRadius: 12,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing(1),
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    transition: 'all 0.3s ease',
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderColor: theme.palette.secondary.main
    }
}));

const DescriptionField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        transition: 'all 0.3s ease',
        '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.9)'
        },
        '&.Mui-focused': {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            boxShadow: `0 0 0 2px ${theme.palette.primary.light}`
        }
    },
    '& .MuiInputBase-inputMultiline': {
        height: '100% !important',
        minHeight: '200px !important',
        overflow: 'auto !important'
    }
}));

const PulseDot = styled(Box)(({ theme }) => ({
    width: 10,
    height: 10,
    borderRadius: '50%',
    backgroundColor: theme.palette.error.main,
    marginRight: theme.spacing(1),
    animation: 'pulse 1.5s infinite ease-in-out'
}));

function EditMemory({ memoryId, userData, handleLogout, navigateTo }) {
    const navigate = useNavigate();
    const [sections, setSections] = useState([]);
    const [memory, setMemory] = useState(null);
    const recognitionRef = useRef(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeSection, setActiveSection] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [sectionToDelete, setSectionToDelete] = useState(null);

    useEffect(() => {
        const fetchMemoryData = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                
                // Fetch memory details
                const memoryRes = await axios.get(`http://localhost:5000/api/memories/${memoryId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                // Fetch memory sections
                const sectionsRes = await axios.get(`http://localhost:5000/api/memories/${memoryId}/sections`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                setMemory(memoryRes.data);
                
                // Transform sections data to match our state structure
                const transformedSections = sectionsRes.data.map(section => ({
                    id: section.section_id,
                    image: null, // We'll keep this null since we have image_url
                    imagePreview: section.image_url,
                    description: section.description,
                    caption: section.caption,
                    isRecording: false,
                    interimTranscript: ''
                }));

                setSections(transformedSections);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching memory data:', error);
                showMessage(error.response?.data?.message || 'Failed to load memory');
                setLoading(false);
            }
        };

        if (memoryId) {
            fetchMemoryData();
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [memoryId]);

    const showMessage = (message) => {
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    };

    const handleImageChange = (e, index) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const updatedSections = [...sections];
                updatedSections[index] = {
                    ...updatedSections[index],
                    image: file, // Store the file object
                    imagePreview: event.target.result // Store the preview URL
                };
                setSections(updatedSections);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCaptionChange = (e, index) => {
        const updatedSections = [...sections];
        updatedSections[index] = {
            ...updatedSections[index],
            caption: e.target.value
        };
        setSections(updatedSections);
    };

    const handleDescriptionChange = (e, index) => {
        const updatedSections = [...sections];
        updatedSections[index] = {
            ...updatedSections[index],
            description: e.target.value,
            interimTranscript: '' // Clear interim transcript when typing manually
        };
        setSections(updatedSections);
    };

    const toggleSpeechRecognition = (index) => {
        const updatedSections = [...sections];
        const isRecording = !updatedSections[index].isRecording;

        if (isRecording) {
            startSpeechRecognition(index);
            showMessage("Recording started. Click mic again to stop.");
        } else {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
                showMessage("Recording stopped");

                updatedSections[index] = {
                    ...updatedSections[index],
                    description: updatedSections[index].description +
                        (updatedSections[index].interimTranscript ?
                            ' ' + updatedSections[index].interimTranscript : ''),
                    interimTranscript: ''
                };
            }
        }

        updatedSections[index] = {
            ...updatedSections[index],
            isRecording
        };

        setSections(updatedSections);
    };

    const startSpeechRecognition = (index) => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            showMessage("Speech recognition not supported in this browser");
            return;
        }

        const recognizer = new SpeechRecognition();
        recognitionRef.current = recognizer;

        recognizer.continuous = true;
        recognizer.interimResults = true;
        recognizer.lang = 'en-US';

        recognizer.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript + ' ';
                } else {
                    interimTranscript += transcript;
                }
            }

            setSections(prevSections => {
                const newSections = [...prevSections];
                newSections[index] = {
                    ...newSections[index],
                    description: newSections[index].description + finalTranscript,
                    interimTranscript: interimTranscript
                };
                return newSections;
            });
        };

        recognizer.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            setSections(prevSections => {
                const newSections = [...prevSections];
                newSections[index] = {
                    ...newSections[index],
                    isRecording: false,
                    interimTranscript: ''
                };
                return newSections;
            });
            showMessage(`Error: ${event.error}`);
        };

        recognizer.onend = () => {
            if (sections[index].isRecording) {
                recognizer.start();
            }
        };

        try {
            recognizer.start();
        } catch (error) {
            showMessage("Error starting microphone: " + error.message);
        }
    };

    const addNewSection = () => {
        setSections([...sections, {
            id: null, // New sections won't have an ID initially
            image: null,
            imagePreview: '',
            description: '',
            caption: '',
            isRecording: false,
            interimTranscript: ''
        }]);
        setActiveSection(sections.length);
    };

    const promptDeleteSection = (index) => {
        if (sections.length <= 1) {
            showMessage("You need at least one section");
            return;
        }
        setSectionToDelete(index);
        setShowDeleteDialog(true);
    };

    const deleteSection = async () => {
        const index = sectionToDelete;
        const sectionId = sections[index].id;
        
        try {
            // If section has an ID, it exists in the backend and needs to be deleted
            if (sectionId) {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:5000/api/memories/${memoryId}/sections/${sectionId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            }
            
            // Update UI state
            const updatedSections = [...sections];
            updatedSections.splice(index, 1);
            setSections(updatedSections);
            setActiveSection(Math.max(0, index - 1));
            showMessage("Section deleted successfully");
        } catch (error) {
            console.error('Error deleting section:', error);
            showMessage(error.response?.data?.message || 'Failed to delete section');
        } finally {
            setShowDeleteDialog(false);
            setSectionToDelete(null);
        }
    };

    const saveChanges = async () => {
        if (sections.some(s => !s.imagePreview || !s.description)) {
            showMessage("Please fill all sections completely");
            return;
        }

        setIsSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            // Update memory title if needed (you might want to add a title field to edit)
            // await axios.put(`http://localhost:5000/api/memories/${memoryId}`, {
            //     title: memory.title
            // }, {
            //     headers: { 'Authorization': `Bearer ${token}` }
            // });

            // Update each section
            for (let i = 0; i < sections.length; i++) {
                const section = sections[i];
                const formData = new FormData();
                
                formData.append('sectionNumber', i + 1);
                formData.append('description', section.description);
                formData.append('caption', section.caption || `Section ${i + 1}`);
                
                // Only append image if it's a new file
                if (section.image) {
                    formData.append('sectionImage', section.image);
                    formData.append('desiredFilename', `section-${Date.now()}-${i + 1}`);
                }

                if (section.id) {
                    // Update existing section
                    await axios.put(
                        `http://localhost:5000/api/memories/${memoryId}/sections/${section.id}`,
                        formData,
                        {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'multipart/form-data'
                            }
                        }
                    );
                } else {
                    // Create new section
                    await axios.post(
                        `http://localhost:5000/api/memories/${memoryId}/sections`,
                        formData,
                        {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'multipart/form-data'
                            }
                        }
                    );
                }
            }

            showMessage("Memory updated successfully!");
            navigateTo('MemoryDetail', memoryId); // Navigate back to memory detail view
        } catch (error) {
            console.error('Error saving memory:', error);
            showMessage(error.response?.data?.message || 'Failed to update memory');
        } finally {
            setIsSubmitting(false);
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

    if (!memory) {
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
                <Typography variant="h5" sx={{ mb: 3, textAlign: 'center' }}>Memory not found</Typography>
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Button
                        onClick={() => navigateTo('Home')}
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
        <>
            <ResponsiveAppBar
                userData={userData}
                onLogout={handleLogout}
                navigateTo={navigateTo}
                currentComponent="EditMemory"
            />

            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                my: 4,
                minHeight: '100vh',
                p: { xs: 1, md: 3 },
                background: 'linear-gradient(to bottom, #e0eafc, #cfdef3)'
            }}>
                <Fade in={true} timeout={800}>
                    <StyledCard>
                        <CardContent sx={{ p: { xs: 1, md: 3 }, mt: { xs: 2 } }}>
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <IconButton onClick={() => navigateTo('MemoryDetail', memoryId)} sx={{ mr: 1 }}>
                                        <ArrowBackIcon />
                                    </IconButton>
                                    <Typography variant="h4" sx={{
                                        color: 'primary.main',
                                        fontWeight: 'bold',
                                        textAlign: 'center',
                                        fontFamily: '"Montserrat", sans-serif',
                                        flexGrow: 1
                                    }}>
                                        Edit Memory: {memory.title}
                                    </Typography>
                                </Box>
                                <Divider sx={{
                                    mb: 3,
                                    background: 'linear-gradient(to right, transparent, #3f51b5, transparent)',
                                    height: 2
                                }} />
                            </motion.div>

                            {sections.map((section, index) => (
                                <Grow in={true} timeout={500 + (index * 200)} key={index}>
                                    <SectionContainer sx={{
                                        display: activeSection === index ? 'block' : 'none',
                                        position: 'relative'
                                    }}>
                                        <IconButton
                                            onClick={() => promptDeleteSection(index)}
                                            sx={{
                                                position: 'absolute',
                                                right: 16,
                                                top: 16,
                                                color: 'error.main',
                                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(255, 0, 0, 0.1)'
                                                },
                                                zIndex: 1
                                            }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>

                                        <Grid container spacing={3}>
                                            <Grid item xs={12} md={4}>
                                                {section.imagePreview ? (
                                                    <Box sx={{ position: 'relative' }}>
                                                        <motion.div
                                                            initial={{ scale: 0.9 }}
                                                            animate={{ scale: 1 }}
                                                            transition={{ duration: 0.3 }}
                                                        >
                                                            <Box sx={{
                                                                mb: 2,
                                                                border: '1px solid rgba(0, 0, 0, 0.1)',
                                                                borderRadius: 12,
                                                                display: 'flex',
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                height: 200,
                                                                overflow: 'hidden',
                                                                position: 'relative',
                                                                boxShadow: 3
                                                            }}>
                                                                <img
                                                                    src={section.imagePreview}
                                                                    alt={`Preview ${index + 1}`}
                                                                    style={{
                                                                        width: '100%',
                                                                        height: '100%',
                                                                        objectFit: 'cover',
                                                                        transition: 'transform 0.3s ease'
                                                                    }}
                                                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                                                />
                                                                <Box sx={{
                                                                    position: 'absolute',
                                                                    top: 8,
                                                                    right: 8,
                                                                    zIndex: 1
                                                                }}>
                                                                    <IconButton
                                                                        component="label"
                                                                        color="primary"
                                                                        sx={{
                                                                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                                                            '&:hover': {
                                                                                backgroundColor: 'rgba(255, 255, 255, 1)'
                                                                            }
                                                                        }}
                                                                    >
                                                                        <EditIcon />
                                                                        <input
                                                                            type="file"
                                                                            hidden
                                                                            accept="image/*"
                                                                            onChange={(e) => handleImageChange(e, index)}
                                                                        />
                                                                    </IconButton>
                                                                </Box>
                                                            </Box>
                                                        </motion.div>
                                                        <TextField
                                                            fullWidth
                                                            label={`Caption for Image ${index + 1}`}
                                                            variant="outlined"
                                                            value={section.caption}
                                                            onChange={(e) => handleCaptionChange(e, index)}
                                                            sx={{
                                                                mt: 1,
                                                                '& .MuiOutlinedInput-root': {
                                                                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                                                    borderRadius: 2
                                                                }
                                                            }}
                                                        />
                                                    </Box>
                                                ) : (
                                                    <motion.div
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                    >
                                                        <UploadButton
                                                            component="label"
                                                            variant="outlined"
                                                            fullWidth
                                                        >
                                                            <PhotoCameraIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                                                            <Typography variant="body2" color="textSecondary">
                                                                Click to upload image
                                                            </Typography>
                                                            <input
                                                                type="file"
                                                                hidden
                                                                accept="image/*"
                                                                onChange={(e) => handleImageChange(e, index)}
                                                            />
                                                        </UploadButton>
                                                    </motion.div>
                                                )}
                                            </Grid>

                                            <Grid item xs={12} md={8}>
                                                <motion.div
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.2 }}
                                                >
                                                    <DescriptionField
                                                        label={`Memory Description ${index + 1}`}
                                                        multiline
                                                        rows={12}
                                                        variant="outlined"
                                                        fullWidth
                                                        value={section.description + (section.interimTranscript ? ' ' + section.interimTranscript : '')}
                                                        onChange={(e) => handleDescriptionChange(e, index)}
                                                        InputProps={{
                                                            endAdornment: (
                                                                <Box sx={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    position: 'absolute',
                                                                    bottom: 8,
                                                                    right: 8
                                                                }}>
                                                                    {section.isRecording && (
                                                                        <>
                                                                            <CircularProgress size={20} color="error" sx={{ mr: 1 }} />
                                                                            <PulseDot />
                                                                        </>
                                                                    )}
                                                                    <motion.div
                                                                        whileHover={{ scale: 1.1 }}
                                                                        whileTap={{ scale: 0.9 }}
                                                                    >
                                                                        <IconButton
                                                                            onClick={() => toggleSpeechRecognition(index)}
                                                                            color={section.isRecording ? "error" : "default"}
                                                                            sx={{
                                                                                backgroundColor: section.isRecording ? 'rgba(244, 67, 54, 0.1)' : 'rgba(63, 81, 181, 0.1)',
                                                                                '&:hover': {
                                                                                    backgroundColor: section.isRecording ? 'rgba(244, 67, 54, 0.2)' : 'rgba(63, 81, 181, 0.2)'
                                                                                }
                                                                            }}
                                                                        >
                                                                            <MicIcon />
                                                                        </IconButton>
                                                                    </motion.div>
                                                                </Box>
                                                            )
                                                        }}
                                                    />
                                                </motion.div>
                                            </Grid>
                                        </Grid>
                                    </SectionContainer>
                                </Grow>
                            ))}

                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                mt: 4,
                                p: 1
                            }}>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        startIcon={<AddCircleOutlineIcon />}
                                        onClick={addNewSection}
                                        sx={{
                                            px: 4,
                                            py: 1.5,
                                            borderRadius: 8,
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        Add Section
                                    </Button>
                                </motion.div>

                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    {sections.length > 1 && (
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => setActiveSection(prev => Math.max(0, prev - 1))}
                                            disabled={activeSection === 0}
                                            sx={{
                                                px: 4,
                                                py: 1.5,
                                                borderRadius: 8,
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            Previous
                                        </Button>
                                    )}

                                    {activeSection < sections.length - 1 ? (
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => setActiveSection(prev => Math.min(sections.length - 1, prev + 1))}
                                            sx={{
                                                px: 4,
                                                py: 1.5,
                                                borderRadius: 8,
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            Next
                                        </Button>
                                    ) : (
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={saveChanges}
                                                disabled={isSubmitting || sections.some(s => !s.imagePreview || !s.description)}
                                                sx={{
                                                    px: 4,
                                                    py: 1.5,
                                                    borderRadius: 8,
                                                    fontWeight: 'bold',
                                                    background: 'linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)',
                                                    boxShadow: '0 3px 5px 2px rgba(76, 175, 80, .3)'
                                                }}
                                                startIcon={<SaveIcon />}
                                            >
                                                {isSubmitting ? (
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                                                        Saving...
                                                    </Box>
                                                ) : 'Save Changes'}
                                            </Button>
                                        </motion.div>
                                    )}
                                </Box>
                            </Box>

                            {sections.length > 1 && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, gap: 1 }}>
                                    {sections.map((_, idx) => (
                                        <motion.div
                                            key={idx}
                                            whileHover={{ scale: 1.2 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <IconButton
                                                onClick={() => setActiveSection(idx)}
                                                sx={{
                                                    p: 0,
                                                    color: activeSection === idx ? 'primary.main' : 'text.secondary'
                                                }}
                                            >
                                                <Avatar
                                                    sx={{
                                                        width: 12,
                                                        height: 12,
                                                        backgroundColor: activeSection === idx ? 'primary.main' : 'action.disabled'
                                                    }}
                                                />
                                            </IconButton>
                                        </motion.div>
                                    ))}
                                </Box>
                            )}
                        </CardContent>
                    </StyledCard>
                </Fade>

                {/* Delete Section Confirmation Dialog */}
                <Dialog
                    open={showDeleteDialog}
                    onClose={() => setShowDeleteDialog(false)}
                    PaperProps={{
                        sx: {
                            borderRadius: '16px',
                            background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                            p: 2,
                            width: '90%',
                            maxWidth: '400px'
                        }
                    }}
                >
                    <DialogTitle sx={{ fontWeight: 700, color: 'error.main', textAlign: 'center' }}>
                        Delete Section
                    </DialogTitle>
                    <DialogContent>
                        <Typography variant="body1" sx={{ textAlign: 'center' }}>
                            Are you sure you want to delete this section?
                            <br />
                            This action cannot be undone.
                        </Typography>
                    </DialogContent>
                    <DialogActions sx={{ justifyContent: 'center', pb: 3, gap: 2 }}>
                        <Button
                            onClick={() => setShowDeleteDialog(false)}
                            variant="outlined"
                            sx={{ borderRadius: '20px', px: 4 }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={deleteSection}
                            variant="contained"
                            color="error"
                            sx={{
                                borderRadius: '20px',
                                px: 4,
                                background: 'linear-gradient(45deg, #FF5252, #FF4081)',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #D32F2F, #E91E63)'
                                }
                            }}
                        >
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>

                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={3000}
                    onClose={() => setSnackbarOpen(false)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    TransitionComponent={Slide}
                >
                    <Alert
                        onClose={() => setSnackbarOpen(false)}
                        severity={snackbarMessage.includes('success') ? 'success' : 
                                 snackbarMessage.includes('Error') ? 'error' : 'info'}
                        sx={{
                            width: '100%',
                            boxShadow: 3,
                            borderRadius: 2
                        }}
                    >
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </Box>

            <style jsx global>{`
                @keyframes pulse {
                    0% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(1.2); }
                    100% { opacity: 1; transform: scale(1); }
                }
                
                body {
                    background: linear-gradient(to bottom, #e0eafc, #cfdef3);
                    font-family: 'Roboto', sans-serif;
                }
            `}</style>
        </>
    );
}
// MemoryDetail
export default EditMemory;