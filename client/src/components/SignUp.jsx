import React, { useState } from 'react';
import axios from 'axios';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    TextField,
    Typography,
    Link,
    Grid,
    Snackbar,
    Alert
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


function SignUp({ onBack, onSignIn }) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('info');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.firstName || !formData.lastName) {
            setError('First name and last name are required');
            return;
        }
        setLoading(true);
        setError('');

        console.log('Submitting:', formData);

        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', {
                firstName: formData.firstName,  // Keep camelCase here
                lastName: formData.lastName,
                username: formData.username,
                email: formData.email,
                password: formData.password
            });

            setSnackbarMessage('Registration successful! Redirecting to sign in...');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);

            console.log('Registration successful:', response.data);

            setTimeout(() => {
                onSignIn();  // Call the onSignIn prop to switch components
            }, 2000);

        } catch (err) {
            setSnackbarMessage(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Add error display near your form header
    // {error && (
    //     <Typography color="error" align="center" sx={{ mb: 2 }}>
    //         {error}
    //     </Typography>
    // )}

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                bgcolor: '#1c2541',
                p: 3
            }}
        >
            <Card
                sx={{
                    width: '100%',
                    maxWidth: 500,
                    borderRadius: 4, // Increased border radius
                    boxShadow: '0px 10px 25px rgba(0, 0, 0, 0.2)', // Enhanced shadow
                    background: 'linear-gradient(135deg, rgba(157,168,238,0.9) 0%, rgba(205,227,241,0.9) 50%, rgba(255,255,255,0.9) 100%)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
            >
                <CardContent sx={{ p: 4 }}>
                    {/* <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={onBack}
                        sx={{
                            mb: 2,
                            borderRadius: 2,
                            textTransform: 'none'
                        }}
                    >
                        Back
                    </Button> */}

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            mb: 4
                        }}
                    >
                        <Avatar sx={{
                            m: 1,
                            bgcolor: 'primary.main',
                            width: 56,
                            height: 56
                        }}>
                            <LockOutlinedIcon fontSize="medium" />
                        </Avatar>
                        <Typography component="h1" variant="h4" sx={{ fontWeight: 700 }}>
                            Create Account
                        </Typography>
                    </Box>


                    <Box component="form" onSubmit={handleSubmit}>
                        {/* Name Fields Container - Custom Flex Layout */}
                        <Box sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 2,
                            mb: 3,
                            width: '100%',
                            '& > *': {  // Targets all direct children
                                flex: '1 1 200px',  // Flex-grow, flex-shrink, flex-basis
                                minWidth: '200px'   // Minimum width before wrapping
                            }
                        }}>
                            <TextField
                                autoComplete="given-name"
                                name="firstName"
                                required
                                fullWidth
                                label="First Name"
                                variant="outlined"
                                size="medium"
                                value={formData.firstName}
                                onChange={handleChange}
                                sx={{
                                    flex: 1,
                                    width: {
                                        xs: '130%',
                                        sm: '130%',
                                        md: '70%',
                                        lg: '70%',
                                    },
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        fontSize: '1rem'
                                    }
                                }}
                            />
                            <TextField
                                required
                                fullWidth
                                label="Last Name"
                                name="lastName"
                                variant="outlined"
                                size="medium"
                                value={formData.lastName}
                                onChange={handleChange}
                                sx={{
                                    flex: 1,
                                    width: {
                                        xs: '130%',
                                        sm: '130%',
                                        md: '70%',
                                        lg: '70%',
                                    },
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        fontSize: '1rem'
                                    }
                                }}
                            />
                        </Box>

                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="Username"
                                name="username"
                                variant="outlined"
                                size="medium"
                                value={formData.username}
                                onChange={handleChange}
                                sx={{
                                    mb: 2,
                                    width: {
                                        xs: '100%',
                                        sm: '100%',
                                        md: '100%',
                                        lg: '100%',
                                    },
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        fontSize: '1.1rem',
                                        height: 56
                                    }
                                }}
                            />
                        </Grid>


                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="Email"
                                name="email"
                                type="email"
                                variant="outlined"
                                size="medium"
                                value={formData.email}
                                onChange={handleChange}
                                sx={{
                                    mb: 2,
                                    width: {
                                        xs: '100%',
                                        sm: '100%',
                                        md: '100%',
                                        lg: '100%',
                                    },
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        fontSize: '1.1rem',
                                        height: 56
                                    }
                                }}
                            />
                        </Grid>


                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                variant="outlined"
                                size="medium"
                                value={formData.password}
                                onChange={handleChange}
                                sx={{
                                    width: {
                                        xs: '100%',
                                        sm: '100%',
                                        md: '100%',
                                        lg: '100%',
                                    },
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        fontSize: '1.1rem',
                                        height: 56
                                    }
                                }}
                            />
                        </Grid>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={loading}
                            sx={{
                                mt: 4,
                                mb: 3,
                                py: 1.5,
                                borderRadius: 2,
                                fontSize: '1rem',
                                fontWeight: 600,
                                textTransform: 'none',
                                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                                '&:hover': {
                                    boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.2)'
                                }
                            }}
                        >
                            {loading ? 'Registering...' : 'Sign Up'}
                        </Button>

                        <Typography variant="body1" align="center" sx={{ color: 'text.secondary' }}>
                            Already have an account?{' '}
                            <Link
                                // href="#" 
                                component="button"
                                underline="hover"
                                sx={{ fontWeight: 600 }}
                                onClick={(e) => {
                                    // e.preventDefault();
                                    onSignIn();
                                }}>
                                Sign In
                            </Link>
                        </Typography>
                        <Snackbar
                            open={snackbarOpen}
                            autoHideDuration={3000}
                            onClose={() => setSnackbarOpen(false)}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                        >
                            <Alert
                                onClose={() => setSnackbarOpen(false)}
                                severity={snackbarSeverity}
                                sx={{ width: '100%' }}
                            >
                                {snackbarMessage}
                            </Alert>
                        </Snackbar>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}

export default SignUp;