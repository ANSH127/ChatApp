import React from 'react'
import supabase from '../config/SupabaseClient'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Typography from '@mui/material/Typography';
import updateSeen from '../composables/UpdateSeen';
import fetchGUser from '../composables/Add_Google_User';

function Home() {
  const navigate = useNavigate()
  





    useEffect(() => {
      const fetchUser = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          console.log(user.app_metadata.provider);
          user.app_metadata.provider === 'google' ?
          fetchGUser(user.id,user.user_metadata.full_name): console.log('');
          updateSeen(user.id);
        }
        else {
          navigate('/login');

        }
      }
      fetchUser();
      // eslint-disable-next-line
    }, [])



    return (
      <>
      <Typography variant="h4" component="div" align='center' 

       gutterBottom>
      Welcome to the Chat App
    </Typography>
      </>
    )
  }

  export default Home