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
import { useNavigate } from 'react-router-dom';

function SignIn({ onSignUp, onSuccessfulLogin }) {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('info');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email: formData.email,
                password: formData.password
            });

            console.log('Login successful:', response.data);

            // Store the token in localStorage or context
            localStorage.setItem('token', response.data.token);

            setSnackbarMessage('Login successful! Redirecting...');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            // Redirect to Home page
            // navigate('/Home');
            onSuccessfulLogin({
                userId: response.data.userId,
                username: response.data.username,
                firstName: response.data.firstName,
                lastName: response.data.lastName,
                email: response.data.email
            });
            console.log("API Response firstName:", response.data.firstName);

        } catch (err) {
            console.error('Login error:', err.response?.data);
            setSnackbarMessage(err.response?.data?.message || 'Login failed. Please try again.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
        }
    };

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
                    borderRadius: 4,
                    boxShadow: '0px 10px 25px rgba(0, 0, 0, 0.2)',
                    background: 'linear-gradient(135deg, rgba(157,168,238,0.9) 0%, rgba(205,227,241,0.9) 50%, rgba(255,255,255,0.9) 100%)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
            >
                <CardContent sx={{ p: 4 }}>
                    {/* <Button  */}
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
                        <Typography
                            component="h1"
                            variant="h4"
                            sx={{ fontWeight: 700 }}>
                            Sign In
                        </Typography>
                    </Box>

                    <Box component="form" onSubmit={handleSubmit}>
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
                                    mb: 2,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        fontSize: '1.1rem',
                                        height: 56
                                    }
                                }}
                            />
                        </Grid>

                        {error && (
                            <Typography color="error" align="center" sx={{ mb: 2 }}>
                                {error}
                            </Typography>
                        )}

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={loading}
                            sx={{
                                mt: 2,
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
                            {loading ? 'Signing In...' : 'Sign In'}
                        </Button>

                        <Typography variant="body1" align="center" sx={{ color: 'text.secondary' }}>
                            Don't have an account?{' '}
                            <Link
                                component="button"
                                underline="hover"
                                sx={{ fontWeight: 600 }}
                                onClick={onSignUp}
                            >
                                Sign Up
                            </Link>
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
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
    );
}

export default SignIn;