import React from 'react'
import supabase from '../config/SupabaseClient'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
function Home() {
  const navigate = useNavigate()
  





    useEffect(() => {
      const fetchUser = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          // console.log(user);
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
        {<div>
          <h1>Home</h1>
        </div>}
      </>
    )
  }

  export default Home