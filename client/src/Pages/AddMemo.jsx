import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { styled } from '@mui/material/styles';
import {
  Box,
  Button,
  Card,
  Grid,
  CardContent,
  TextField,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
  Fade,
  Slide,
  Divider
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Close as CloseIcon,
  Public as PublicIcon,
  Lock as LockIcon,
  CalendarToday as CalendarIcon,
  Title as TitleIcon
} from '@mui/icons-material';
import ResponsiveAppBar from '../components/AppBar';
import { jwtDecode } from 'jwt-decode';  // Add this import at the top

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  width: '95%',
  maxWidth: 800, // Increased max width
  borderRadius: 16,
  boxShadow: theme.shadows[10],
  background: 'linear-gradient(145deg, #ffffff 0%, #f3f4f6 100%)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[12]
  },
  margin: '20px auto' // Center the card
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
  },
  width: '100%' // Ensure full width
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
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
  width: '100%' // Ensure full width
}));

const ResponsiveGrid = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    '& > .MuiGrid-item': {
      width: '100%',
      padding: theme.spacing(1, 0)
    }
  }
}));

function AddMemo({ onMemoryCreated, onCancel, onComplete, userData, navigateTo, onLogout }) {
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [privacy, setPrivacy] = useState('private');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const showMessage = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        showMessage('Image size should be less than 5MB');
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePrivacyChange = (e) => {
    setPrivacy(e.target.value);
  };

  const handleSubmit = async () => {
    const title = document.getElementById('title').value;
    const date = document.getElementById('dateInput').value;
  
    if (!title || !date) {
      showMessage('Please provide a title and date');
      return;
    }
  
    if (!imageFile) {
      showMessage('Please upload a cover image');
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      const token = localStorage.getItem('token');
      
      // Get file extension from the original file
      const fileExt = imageFile.name.split('.').pop().toLowerCase();
      
      // Sanitize the title to create a filename-safe version
      const filenameSafeTitle = title
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')  // Replace special chars with hyphens
        .replace(/-+/g, '-')         // Replace multiple hyphens with single
        .replace(/^-|-$/g, '');      // Remove leading/trailing hyphens
  
      const desiredFilename = `${filenameSafeTitle}.${fileExt}`;
  
      // Convert image to base64 for Cloudinary
      const imageBase64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.readAsDataURL(imageFile);
      });
  
      const response = await fetch('http://localhost:5000/api/memories', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          date,
          isPrivate: privacy === 'private',
          previewImage: imageBase64,
          desiredFilename  // Send the desired filename to backend
        })
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.message || 'Failed to save memory');
      }
  
      showMessage('Memory created successfully!');
      onMemoryCreated({
        memoryId: result.memoryId,
        previewImageUrl: result.previewImageUrl
      });
    } catch (error) {
      console.error('Error saving memory:', error);
      showMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ResponsiveAppBar
        userData={userData}
        onLogout={onLogout}
        navigateTo={navigateTo}
        currentComponent="AddMemo"
      />

      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 64px)',
        p: { xs: 1, sm: 2 },
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
      }}>
        <Fade in={true} timeout={500}>
          <StyledCard>
            <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Typography variant="h4" sx={{
                  color: 'primary.main',
                  fontWeight: 'bold',
                  mb: 2,
                  textAlign: 'center',
                  fontFamily: '"Montserrat", sans-serif',
                }}>
                  Create New Memory
                </Typography>
                <Divider sx={{
                  width: '80%',
                  margin: '0 auto 30px auto',
                  borderBottomWidth: 3, // Increased thickness from 2 to 3
                  borderColor: '#3f51b5', // Blue shade from Material-UI primary color
                  background: 'linear-gradient(90deg, transparent, #3f51b5, transparent)' // Blue gradient
                }} />
              </motion.div>

              <ResponsiveGrid container spacing={3}>
                <Grid item xs={12} md={6} sx={{ mr: 2, ml: 2 }}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <StyledTextField
                      fullWidth
                      id="title"
                      label="Memory Title"
                      variant="outlined"
                      required
                      InputProps={{
                        startAdornment: (
                          <TitleIcon color="action" sx={{ mr: 1 }} />
                        )
                      }}
                      sx={{ mb: 3, mr: 5 }}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <StyledTextField
                      fullWidth
                      id="dateInput"
                      label="Memory Date"
                      type="date"
                      variant="outlined"
                      required
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: (
                          <CalendarIcon color="action" sx={{ mr: 1 }} />
                        )
                      }}
                      sx={{ mb: 3 }}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <FormControl component="fieldset" fullWidth sx={{ mb: 3 }}>
                      <FormLabel component="legend" sx={{ mb: 1 }}>
                        Privacy Settings
                      </FormLabel>
                      <RadioGroup
                        row
                        aria-label="privacy"
                        name="privacy"
                        value={privacy}
                        onChange={handlePrivacyChange}
                        sx={{ flexWrap: 'wrap' }}
                      >
                        <FormControlLabel
                          value="private"
                          control={<Radio color="primary" />}
                          label={
                            <Box display="flex" alignItems="center">
                              <LockIcon fontSize="small" sx={{ mr: 0.5 }} />
                              Private
                            </Box>
                          }
                        />
                        <FormControlLabel
                          value="public"
                          control={<Radio color="primary" />}
                          label={
                            <Box display="flex" alignItems="center">
                              <PublicIcon fontSize="small" sx={{ mr: 0.5 }} />
                              Public
                            </Box>
                          }
                        />
                      </RadioGroup>
                    </FormControl>
                  </motion.div>
                </Grid>

                <Grid item xs={12} md={6}>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Typography variant="subtitle1" gutterBottom>
                      Cover Image
                    </Typography>
                    {imagePreview ? (
                      <Box sx={{ position: 'relative' }}>
                        <motion.div
                          initial={{ scale: 0.9 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Box
                            sx={{
                              border: '1px solid rgba(0, 0, 0, 0.1)',
                              borderRadius: 12,
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              height: 200,
                              overflow: 'hidden',
                              position: 'relative',
                              boxShadow: 3,
                              width: '100%'
                            }}
                          >
                            <img
                              src={imagePreview}
                              alt="Preview"
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                transition: 'transform 0.3s ease'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            />
                            <IconButton
                              onClick={() => {
                                setImagePreview('');
                                setImageFile(null);
                              }}
                              sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                '&:hover': {
                                  backgroundColor: 'rgba(255, 255, 255, 1)'
                                }
                              }}
                            >
                              <CloseIcon />
                            </IconButton>
                          </Box>
                        </motion.div>
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
                          <CloudUploadIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                          <Typography variant="body2" color="textSecondary">
                            Click to upload cover image
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            (Max 5MB)
                          </Typography>
                          <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </UploadButton>
                      </motion.div>
                    )}
                  </motion.div>
                </Grid>
              </ResponsiveGrid>

              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mt: 4,
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 2, sm: 0 }
              }}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={onCancel}
                    disabled={isSubmitting}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 8,
                      fontWeight: 'bold',
                      width: { xs: '100%', sm: 'auto' }
                    }}
                  >
                    Cancel
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 8,
                      fontWeight: 'bold',
                      background: 'linear-gradient(45deg, #3f51b5 30%, #2196f3 90%)',
                      boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
                      width: { xs: '100%', sm: 'auto' }
                    }}
                  >
                    {isSubmitting ? (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                        Creating...
                      </Box>
                    ) : 'Create Memory'}
                  </Button>
                </motion.div>
              </Box>
            </CardContent>
          </StyledCard>
        </Fade>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          TransitionComponent={Slide}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity={snackbarMessage.includes('success') ? 'success' : 'error'}
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
    </>
  );
}

export default AddMemo;