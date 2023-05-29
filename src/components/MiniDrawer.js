import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import LogoutIcon from '@mui/icons-material/Logout';
import { useLocation, useNavigate } from 'react-router-dom';
import supabase from '../config/SupabaseClient';
import { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';

import { toast } from 'react-toastify';

import LoginIcon from '@mui/icons-material/Login';
import AddIcon from '@mui/icons-material/Add';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';



const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);
const menuItems = [
  {
    text: 'Add Friend',
    icon: <GroupAddOutlinedIcon color='primary' />,
    path: '/addfriend'
  },
  {
    text: 'Your Friends',
    icon: <GroupOutlinedIcon color='primary' />,
    path: '/friends'
  },{
    text: 'Chat',
    icon: <MessageOutlinedIcon color='primary' />,
    path: '/msg'
  }

]
const active = {
  background: '#f4f4f4'
}

export default function MiniDrawer({ children }) {
  const fetchUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      // console.log(user);
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



  const [user, setUser] = useState(false);
  const [username, setUsername] = useState('Anonymus');
  const location = useLocation()

  const navigate = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }} >
            ChatApp
          </Typography>
          <Typography>
            {username}
          </Typography>
          <Avatar alt="Remy Sharp" src="/60111.jpg" sx={{ ml: 2 }} />

        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />

        <List>
          {user && menuItems.map((item, index) => (
            <ListItem key={index}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                style={location.pathname === item.path ? active : null}


              >

                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>

            </ListItem>
          ))}

          {!user && <ListItem>
            <ListItemButton
              onClick={() => navigate('/login')}


            >

              <ListItemIcon><LoginIcon color='primary' /></ListItemIcon>
              <ListItemText primary='Login' />


            </ListItemButton>
          </ListItem>}

          {!user && <ListItem>
            <ListItemButton
              onClick={() => navigate('/signup')}

            >

              <ListItemIcon><AddIcon color='primary' /></ListItemIcon>
              <ListItemText primary='Create An Account' />


            </ListItemButton>
          </ListItem>}


          {user &&
            <ListItem>
              <ListItemButton
                onClick={async () => {

                  const { error } = await supabase.auth.signOut()
                  if (error) {
                    console.log('Error logging out:', error.message);
                    toast.error(error.message);
                    return;
                  }

                  setUser(false);
                  navigate('/login')



                }
                }

              >

                <ListItemIcon><LogoutIcon color='primary' /></ListItemIcon>
                <ListItemText primary='Logout' />


              </ListItemButton>
            </ListItem>

          }

        </List>

      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}