import {React,useState,useEffect} from 'react'

import { Button,Container } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import supabase from '../config/SupabaseClient';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const styles = {
    height: '100vh',
    width: '100vw',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff'

}
function Home() {
    const [user, setUser] = useState(false)
    const navigate=useNavigate()
    const fetchUser = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          setUser(true);
    
    
        }
        else {
          console.log('no user');
        }
      }
      useEffect(() => {
        fetchUser();
    
    
    
    
      }, [])
    
    
  return (
    <>
    <Container style={styles}>
        {!user && <Button variant="contained" color="primary" size='large' sx={{margin:'4px 4px'}}
        onClick={
            ()=>{
                navigate('/login')
            }

        }
         >Login</Button>}
        {!user && <Button variant="contained" color="secondary" size='large'
        onClick={
            ()=>{
                navigate('/signup')
            }
        }
        >Sign Up</Button>}

        {user && <Button variant="contained" color="secondary" size='large'
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
        
        >Logout</Button>}
        <ToastContainer />
    </Container>
    </>
  )
}

export default Home