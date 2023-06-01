import React from 'react'

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Grid, Avatar, Button, Container } from '@mui/material';

import Typography from '@mui/material/Typography';
import { useState, useEffect } from 'react';
import supabase from '../config/SupabaseClient';
import { useNavigate } from 'react-router-dom';
import drkthemeloader from '../loading3.gif';
import lythemeloader from '../loading2.gif';




function YourFriend(props) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [requestsent, setRequestsent] = useState([]);
  const [requestreceived, setRequestreceived] = useState([]);
  const [friends, setFriends] = useState([]);
  const [sentloader, setSentloader] = useState(true);
  const [receivedloader, setReceivedloader] = useState(true);
  const [friendloader, setFriendloader] = useState(true);
  const fetchsentRequest = async (id) => {

    const { data, error } = await supabase
      .from('Request')
      .select(`
      *,
      user:request_to (username)
      `)
      .eq('request_from', id)
      .neq('status', 'accepted')
    if (error) {
      console.log(error);
    }
    else {
      setRequestsent(data);
      setSentloader(false);
      // console.log(data);

    }
  }
  const fetchreceivedRequest = async (id) => {

    const { data, error } = await supabase
      .from('Request')
      .select(`
      *,
      user:request_from (username)
      `)
      .eq('request_to', id)
      .neq('status', 'accepted')

    if (error) {
      console.log(error);
    }
    else {
      setRequestreceived(data);
      setReceivedloader(false);
      // console.log(data);
    }
  }
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
      // console.log('friends', data);
      setFriendloader(false);
      // console.log(username);
    }
  }
  const confirmrequest = async (id) => {
    const { error } = await supabase

      .from('Request')
      .update({ status: 'accepted' })
      .eq('id', id)
    if (error) {
      console.log(error);
    }
    else {
      alert('Request Accepted');
    }
  }



  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // console.log(user);
        setUsername(user.id);
        fetchsentRequest(user.id);
        fetchreceivedRequest(user.id);
        fetchFriends(user.id);
      }
      else {
        navigate('/login');

      }
    }
    fetchUser();



    // eslint-disable-next-line
  }, [])

  return (

    <Container>
      <div style={{ textAlign: 'center' }} >
        <h2>Sent Request</h2>
      </div>
      <br />
      {sentloader &&
        <div style={{ textAlign: 'center' }}>
          <img className='my-3' src={
            props.mode === 'dark' ? drkthemeloader : lythemeloader
          } alt="loading" width='35px' />
        </div>}
      {!sentloader && <Grid container spacing={2}>


        {requestsent.map((item, index) => {


          return <Grid item xs={12} sm={6} md={3} key={index} >
            <Card sx={{ display: 'flex' }}  >
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                  <Typography component="div" variant="h5">

                    <Avatar alt="Remy Sharp" src="/60111.jpg" sx={{ ml: 2 }} />
                    {item.user.username}

                  </Typography>
                  <Typography varient="h6" component="div">

                    <Button variant="contained" size='small' color="primary" disabled

                    >
                      Request Sent
                    </Button>
                  </Typography>

                </CardContent>

              </Box>

            </Card>
          </Grid>
        })}

      </Grid>}
      <div style={{ textAlign: 'center' }} >
        <h2>Request Received</h2>
      </div>
      <br />
      {receivedloader &&
        <div style={{ textAlign: 'center' }}>
          <img className='my-3' src={
            props.mode === 'dark' ? drkthemeloader : lythemeloader
          } alt="loading" width='35px' />
        </div>}

      {
        !receivedloader &&
        <Grid container spacing={2}>


          {requestreceived.map((item, index) => {


            return <Grid item xs={12} sm={6} md={3} key={index} >
              <Card sx={{ display: 'flex' }}  >
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flex: '1 0 auto' }}>
                    <Typography component="div" variant="h5">

                      <Avatar alt="Remy Sharp" src="/60111.jpg" sx={{ ml: 2 }} />
                      {item.user.username}

                    </Typography>
                    <Typography varient="h6" component="div">

                      <Button variant="contained" size='small' color="primary"
                        onClick={() => confirmrequest(item.id)}


                      >
                        Confirm
                      </Button>
                    </Typography>

                  </CardContent>

                </Box>

              </Card>
            </Grid>
          })}

        </Grid>}

      <div style={{ textAlign: 'center' }} >
        <h2>Your Friends</h2>
      </div>
      <br />
      {friendloader &&
        <div style={{ textAlign: 'center' }}>
          <img className='my-3' src={
            props.mode === 'dark' ? drkthemeloader : lythemeloader
            
          } alt="loading" width='35px' />
        </div>}


      {
        !friendloader &&
        <Grid container spacing={2}>


          {friends.map((item, index) => {


            return <Grid item xs={12} sm={6} md={3} key={index} >
              <Card sx={{ display: 'flex' }}  >
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flex: '1 0 auto' }}>
                    <Typography component="div" variant="h5">

                      <Avatar alt="Remy Sharp" src="/60111.jpg" sx={{ ml: 2 }} />
                      {item.user.user_id === username ? item.user2.username : item.user.username}

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

export default YourFriend