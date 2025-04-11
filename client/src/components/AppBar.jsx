import * as React from 'react';
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
import "./AppBarStyle.css";

function ResponsiveAppBar({ userData, onLogout, navigateTo, currentComponent }) {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    
    const pages = [
        { name: 'Memory', path: 'Home' },
        { name: 'Add Memo', path: 'AddMemo' },
        { name: 'Shared Memo', path: 'SharedMemo' },
        { name: 'Search', path: 'Search' }
    ];

    const settings = [
        { name: 'Profile', icon: '👤', action: () => navigateTo('Profile') },
        {
            name: 'Logout',
            icon: '🚪',
            action: () => {
                setOpenSnackbar(true);
                setTimeout(() => {
                    onLogout();
                }, 1000);
            }
        }
    ];

    const avatarLetter = userData?.firstName?.[0]?.toUpperCase() || '?';

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
            <AppBar position="static" className="custom-appbar">
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <PhotoAlbumIcon sx={{
                            display: { xs: 'none', md: 'flex' },
                            mr: 1,
                            color: '#5bc0be'
                        }} />
                        <Typography
                            variant="h6"
                            noWrap
                            onClick={() => navigateTo('Home')}
                            sx={{
                                mr: 2,
                                display: { xs: 'none', md: 'flex' },
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: '#ffffff',
                                textDecoration: 'none',
                                '&:hover': {
                                    color: '#5bc0be',
                                    cursor: 'pointer'
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
                                        onClick={() => {
                                            handleCloseNavMenu();
                                            navigateTo(page.path);
                                        }}
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
                            onClick={() => navigateTo('Home')}
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
                                    color: '#5bc0be',
                                    cursor: 'pointer'
                                }
                            }}
                        >
                            Visual-Diary
                        </Typography>

                        {/* Desktop menu */}
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 3 }}>
                            {pages.map((page) => (
                                <Button
                                    key={page.name}
                                    onClick={() => {
                                        handleCloseNavMenu();
                                        navigateTo(page.path);
                                    }}
                                    sx={{
                                        my: 2,
                                        color: currentComponent === page.path ? 'secondary.main' : 'white',
                                        display: 'block',
                                        mx: 1,
                                        fontWeight: currentComponent === page.path ? '600' : '400',
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
                                    }}>
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
                        color: '#1c2541',
                    }}
                >
                    Logging out...
                </Alert>
            </Snackbar>
        </>
    );
}

export default ResponsiveAppBar;