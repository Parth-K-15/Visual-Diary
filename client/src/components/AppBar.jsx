import * as React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import PhotoAlbumIcon from '@mui/icons-material/PhotoAlbum';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useLocation } from 'react-router-dom';
import "./AppBarStyle.css";

const pages = [
    // { name: 'Home', path: '/' },
    { name: 'Memories', path: '/' },
    { name: 'Add Memo', path: '/add-memo' },
    { name: 'Search', path: '/search' }
];

function ResponsiveAppBar({ userData, onLogout }) {
    const location = useLocation();
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [openSnackbar, setOpenSnackbar] = React.useState(false);

    const settings = [
        { name: 'Profile', icon: '👤', action: () => { } },
        {
            name: 'Logout',
            icon: '🚪',
            action: () => {
                setOpenSnackbar(true);
                // Delay the actual logout to let user see the message
                setTimeout(() => {
                    onLogout();
                }, 1000);
            }
        }
    ];

    // Get first letter of first name for avatar
    const avatarLetter = userData?.firstName?.charAt(0)?.toUpperCase() || 'U';

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    return (
        <>

            <AppBar position="static" sx={{ backgroundColor: '#1c2541', boxShadow: 'none' }}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <PhotoAlbumIcon sx={{
                            display: { xs: 'none', md: 'flex' },
                            mr: 1,
                            color: '#5bc0be' // Teal accent color
                        }} />
                        <Typography
                            variant="h6"
                            noWrap
                            component={Link}
                            to="/"
                            sx={{
                                mr: 2,
                                display: { xs: 'none', md: 'flex' },
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: '#ffffff',
                                textDecoration: 'none',
                                '&:hover': {
                                    color: '#5bc0be'
                                }
                            }}
                        >
                            VISUAL DIARY
                        </Typography>

                        {/* Mobile menu */}
                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{
                                    display: { xs: 'block', md: 'none' },
                                    '& .MuiPaper-root': {
                                        backgroundColor: '#1c2541',
                                        color: 'white'
                                    }
                                }}
                            >
                                {pages.map((page) => (
                                    <MenuItem
                                        key={page.name}
                                        onClick={handleCloseNavMenu}
                                        component={Link}
                                        to={page.path}
                                        sx={{
                                            '&:hover': {
                                                backgroundColor: '#2a3655'
                                            }
                                        }}
                                    >
                                        <Typography textAlign="center">{page.name}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>

                        {/* Mobile logo */}
                        <PhotoAlbumIcon sx={{
                            display: { xs: 'flex', md: 'none' },
                            mr: 1,
                            color: '#5bc0be'
                        }} />
                        <Typography
                            variant="h5"
                            noWrap
                            component={Link}
                            to="/"
                            sx={{
                                mr: 2,
                                display: { xs: 'flex', md: 'none' },
                                flexGrow: 1,
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.15rem',
                                color: '#ffffff',
                                textDecoration: 'none',
                                fontSize: '1.1rem',
                                '&:hover': {
                                    color: '#5bc0be'
                                }
                            }}
                        >
                            VISUAL DIARY
                        </Typography>

                        {/* Desktop menu */}
                        <Box sx={{
                            flexGrow: 1,
                            display: { xs: 'none', md: 'flex' },
                            ml: 3
                        }}>
                            {pages.map((page) => (
                                <Button
                                    key={page.name}
                                    component={Link}
                                    to={page.path}
                                    onClick={handleCloseNavMenu}
                                    sx={{
                                        my: 2,
                                        color: location.pathname === page.path ? '#5bc0be' : 'white',
                                        display: 'block',
                                        mx: 1,
                                        fontWeight: location.pathname === page.path ? '600' : '400',
                                        '&:hover': {
                                            color: '#5bc0be',
                                            backgroundColor: 'transparent'
                                        }
                                    }}
                                >
                                    {page.name}
                                </Button>
                            ))}
                        </Box>

                        {/* User settings */}
                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Open settings">
                                <IconButton
                                    onClick={handleOpenUserMenu}
                                    sx={{
                                        p: 0,
                                        '&:hover': {
                                            transform: 'scale(1.1)',
                                            transition: 'transform 0.2s'
                                        }
                                    }}
                                >
                                    <Avatar
                                        sx={{
                                            backgroundColor: '#5bc0be',
                                            color: '#1c2541',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {avatarLetter}
                                    </Avatar>
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{
                                    mt: '45px',
                                    '& .MuiPaper-root': {
                                        backgroundColor: '#1c2541',
                                        color: 'white',
                                        border: '1px solid #5bc0be'
                                    }
                                }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                {settings.map((setting) => (
                                    <MenuItem
                                        key={setting.name}
                                        onClick={() => {
                                            handleCloseUserMenu();
                                            setting.action();
                                        }}
                                        sx={{
                                            '&:hover': {
                                                backgroundColor: '#2a3655'
                                            }
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                textAlign: 'center',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px'
                                            }}
                                        >
                                            <span style={{ fontSize: '1.2rem' }}>{setting.icon}</span>
                                            {setting.name}
                                        </Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity="info"
                    sx={{
                        width: '100%',
                        backgroundColor: '#5bc0be',
                        color: '#1c2541'
                    }}
                >
                    Logging out...
                </Alert>
            </Snackbar>
        </>
    );
}

export default ResponsiveAppBar;