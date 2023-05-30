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
import { useNavigate,useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import supabase from '../config/SupabaseClient';
import { toast } from 'react-toastify';

const pages = [
    {
        name: 'Home',
        path: '/'
    },
    {
        name: 'Add Friend',
        path: '/addfriend'
    },
    {
        name: 'Your Friends',
        path: '/friends'
    },
    {
        name: 'Chat',
        path: '/msg'
    }



];

const active = {
    background: '#f4f4f4'
  }
function ResponsiveAppBar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const [user, setUser] = useState(false);
    const [username, setUsername] = useState('Anonymus');

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
    const fetchUser = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            console.log(user);
            setUser(true);

            user.app_metadata.provider === 'google' ? setUsername(user.user_metadata.full_name) : setUsername(user.user_metadata.username);


        }
        else {
            console.log('no user');
        }
    }
    useEffect(() => {
        fetchUser();




    }, [])


    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        CHATAPP
                    </Typography>

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
                            }}
                        >
                            {user && pages.map((page) => (
                                <MenuItem key={page.name} onClick={
                                    () => {
                                        navigate(page.path);
                                        handleCloseNavMenu();
                                    }



                                }
                                
                                style={location.pathname === page.path ? active : null}
                                >
                                    <Typography textAlign="center">{page.name}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href=""
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        CHATAPP
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {user && pages.map((page) => (
                            <Button
                                key={page.name}
                                onClick={
                                    () => {
                                        navigate(page.path);
                                    }
                                }
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                {page.name}
                            </Button>
                        ))}
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt="Remy Sharp" src="/60111.jpg" />

                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
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
                            {user &&
                            <MenuItem >
                            
                                <Typography textAlign="center" onClick={handleCloseUserMenu}>{username}</Typography>
                            </MenuItem>
                            }
                            {user && <MenuItem onClick={async() => {
                                const { error } = await supabase.auth.signOut()
                                if (error) {
                                  console.log('Error logging out:', error.message);
                                  toast.error(error.message);
                                  return;
                                }
              
                                setUser(false);
                                toast.success('Logout successfully');
                                handleCloseUserMenu();
                                navigate('/login')
              
                            }}>
                                <Typography textAlign="center">Logout</Typography>
                            </MenuItem>

                            }
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default ResponsiveAppBar;