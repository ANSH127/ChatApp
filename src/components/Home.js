import React from 'react'
import supabase from '../config/SupabaseClient'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Typography from '@mui/material/Typography';
import updateSeen from '../composables/UpdateSeen';

function Home() {
  const navigate = useNavigate()
  





    useEffect(() => {
      const fetchUser = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
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