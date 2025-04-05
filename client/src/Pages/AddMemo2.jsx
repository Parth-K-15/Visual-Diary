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
    Alert
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import MicIcon from '@mui/icons-material/Mic';
import DeleteIcon from '@mui/icons-material/Delete'; // Added delete icon
import ResponsiveAppBar from "../components/AppBar";

function AddMemo2() {
    const [sections, setSections] = useState([{
        image: null,
        imagePreview: '',
        description: '',
        isRecording: false,
        interimTranscript: ''
    }]);
    const recognitionRef = useRef(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    // Cleanup recognition on unmount
    useEffect(() => {
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

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
                    image: file,
                    imagePreview: event.target.result
                };
                setSections(updatedSections);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDescriptionChange = (e, index) => {
        const updatedSections = [...sections];
        updatedSections[index] = {
            ...updatedSections[index],
            description: e.target.value,
            interimTranscript: '' // Clear interim when typing manually
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

                // Save interim transcript to final description
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
                // Automatically restart if still supposed to be recording
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
            image: null,
            imagePreview: '',
            description: '',
            isRecording: false,
            interimTranscript: ''
        }]);
    };

    // New function to delete a section
    const deleteSection = (index) => {
        if (sections.length <= 1) {
            showMessage("You need at least one section");
            return;
        }

        const updatedSections = [...sections];
        updatedSections.splice(index, 1);
        setSections(updatedSections);
        showMessage("Section deleted");
    };

    const handleShare = () => {
        console.log("Data to be saved:", sections);
        alert("Memory saved successfully! (Backend integration coming soon)");
    };

    return (
        <>
            <ResponsiveAppBar />
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                my: 4,
                minHeight: '100vh',
                p: { xs: 1, md: 3 },
            }}>
                <Card sx={{
                    width: '95%',
                    maxWidth: 900,
                    boxShadow: 3,
                    background: 'linear-gradient(90deg, rgba(157, 168, 238, 1) 0%, rgba(205, 227, 241, 1) 39%, rgba(255, 255, 255, 1) 99%)',
                    p: {sm:3, xs:1,md:1}
                }}>
                    <CardContent sx={{ p: { xs: 1, md: 3 }, mt: { xs: 2 } }}>
                        <Typography variant="h5" sx={{
                            color: 'primary.main',
                            fontWeight: 'bold',
                            mb: 2
                        }}>
                            Add Memory Details
                        </Typography>
                        <Divider variant="middle" sx={{
                            mb: 1,
                            color: 'black',
                            width: '100%',
                            fontWeight: 'bold'
                        }} />

                        {sections.map((section, index) => (
                            <Box key={index} sx={{ mb: 4, p: 2, position: 'relative' }}>
                                {/* Delete button - positioned top right */}
                                {sections.length > 1 && (
                                    <IconButton
                                        onClick={() => deleteSection(index)}
                                        sx={{
                                            position: 'absolute',
                                            right: 3,
                                            bottom: 60,
                                            // ml: 3,
                                            color: 'error.main',
                                            backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                            '&:hover': {
                                                backgroundColor: 'rgba(255, 0, 0, 0.1)'
                                            }
                                        }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                )}

                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={4} mr={3}>
                                        {section.imagePreview && (
                                            <Box sx={{
                                                mb: 2,
                                                border: '1px dashed grey',
                                                borderRadius: 1,
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                minHeight: 200,
                                                overflow: 'hidden',
                                                p: 1
                                            }}>
                                                <img
                                                    src={section.imagePreview}
                                                    alt={`Preview ${index + 1}`}
                                                    style={{
                                                        maxWidth: '100%',
                                                        maxHeight: '100%',
                                                        objectFit: 'contain'
                                                    }}
                                                />
                                            </Box>
                                        )}
                                        <Button
                                            component="label"
                                            variant="outlined"
                                            startIcon={<CloudUploadIcon />}
                                            fullWidth
                                            sx={{ p: 1.5 }}
                                        >
                                            Upload Image
                                            <input
                                                type="file"
                                                hidden
                                                accept="image/*"
                                                onChange={(e) => handleImageChange(e, index)}
                                            />
                                        </Button>
                                    </Grid>

                                    <Grid item xs={12} md={8}>
                                        <TextField
                                            className='Textfield-Description'
                                            label={`Description ${index + 1}`}
                                            multiline
                                            rows={10}
                                            variant="outlined"
                                            value={section.description + (section.interimTranscript ? ' ' + section.interimTranscript : '')}
                                            onChange={(e) => handleDescriptionChange(e, index)}
                                            sx={{
                                                width: {
                                                    xs: '140%',      // 0px - 599px (Mobile)
                                                    sm: '200%',      // 600px - 899px (Small tablets)
                                                    md: '250%',      // 900px - 1199px (Tablets)
                                                    lg: '250%',
                                                },
                                                '& .MuiInputBase-root': {
                                                    height: '100%',
                                                    alignItems: 'flex-start',
                                                    p: 1
                                                },
                                                '& .MuiInputBase-inputMultiline': {
                                                    height: '100%',
                                                    overflow: 'auto'
                                                }
                                            }}
                                            InputProps={{
                                                endAdornment: (
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        {section.isRecording && (
                                                            <>
                                                                <CircularProgress size={24} color="error" sx={{ mr: 1 }} />
                                                                <Box sx={{
                                                                    width: 10,
                                                                    height: 10,
                                                                    borderRadius: '50%',
                                                                    bgcolor: 'error.main',
                                                                    mr: 1,
                                                                    animation: 'pulse 1s infinite'
                                                                }} />
                                                            </>
                                                        )}
                                                        <IconButton
                                                            onClick={() => toggleSpeechRecognition(index)}
                                                            color={section.isRecording ? "error" : "default"}
                                                            sx={{
                                                                p: 1,
                                                                bgcolor: section.isRecording ? 'rgba(244, 67, 54, 0.1)' : 'transparent'
                                                            }}
                                                        >
                                                            <MicIcon />
                                                        </IconButton>
                                                    </Box>
                                                )
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                                {index < sections.length - 1 && <Divider sx={{ my: 3 }} />}
                            </Box>
                        ))}

                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            mt: 3,
                            p: 1
                        }}>
                            <Button
                                variant="contained"
                                color="secondary"
                                startIcon={<AddCircleOutlineIcon />}
                                onClick={addNewSection}
                                sx={{ px: 3, py: 1.5 }}
                            >
                                Add Section
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleShare}
                                disabled={sections.some(s => !s.image || !s.description)}
                                sx={{ px: 3, py: 1.5 }}
                            >
                                Share Memory
                            </Button>
                        </Box>
                    </CardContent>
                </Card>

                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={3000}
                    onClose={() => setSnackbarOpen(false)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert onClose={() => setSnackbarOpen(false)} severity="info">
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </Box>

            <style jsx global>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
        </>
    );
}

export default AddMemo2;