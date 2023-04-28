import React from 'react'

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Grid, Avatar, Button, Container } from '@mui/material';

import Typography from '@mui/material/Typography';
import { useState, useEffect } from 'react';
import supabase from '../config/SupabaseClient';
import { useNavigate } from 'react-router-dom';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import loading from '../loading.gif' 

function Message() {
    
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [friends, setFriends] = useState([]);
  const [loader, setLoader] = useState(true);
  const fetchFriends = async (id) => {

    const { data, error } = await supabase
      .from('Request')
      .select(`
      *,
      user:request_from (*),
      user2:request_to (*)
      `)
      .eq('status', 'accepted')
      .or(`request_to.eq.${id},request_from.eq.${id}`)
    if (error) {
      console.log(error);
    }
    else {
      setFriends(data);
      console.log('friends', data);
      console.log(username);
        setLoader(false);
    }
  }
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        console.log(user);
        setUsername(user.id);
        fetchFriends(user.id);
      }
      else {
        navigate('/login');

      }
    }
    fetchUser();



    // eslint-disable-next-line
  }, [])
  const popmsgbox = (id) => {
    console.log(id);
    navigate(`/chat/${id}`);
  }
  

  return (
    <Container>
        <div style={{ textAlign: 'center' }} >
        <h2>Your Friends</h2>
      </div>
      <br />
      {loader &&
      
      <div style={{textAlign:'center'}}>
      <img className='my-3' src={loading} alt="loading" width='35px' />
  </div>
      }
      {!loader && <Grid container spacing={2}>


{friends.map((item, index) => {


  return <Grid item xs={12} sm={6} md={3} key={index} >
    <Card sx={{ display: 'flex' }}  >
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography component="div" variant="h5">

            <Avatar alt="Remy Sharp" src="/60111.jpg" sx={{ ml: 2 }} />
            {item.user.user_id === username ? item.user2.username : item.user.username}

          </Typography>
          <Typography varient="h6" component="div">

                    <Button variant="contained" size='small' color="primary"
                      onClick={() => popmsgbox(item.id)}


                    >
                        <MessageOutlinedIcon />  Message

                    </Button>
                  </Typography>


        </CardContent>

      </Box>

    </Card>
  </Grid>
})}

</Grid>}

    </Container>
  )
}

export default Message