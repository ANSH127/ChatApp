import React from 'react'
import { Typography, Button, TextField, Container } from '@mui/material'
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import { useState } from 'react';
import supabase from '../config/SupabaseClient';
import { useNavigate } from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Login(props) {
    // console.log(props.mode);
    const navigate = useNavigate()
    const [details, setDetails] = useState({
        email: '',
        password: ''

    });
    const handleSubmit = async (e) => {
        e.preventDefault();

        const { data, error } = await supabase.auth.signInWithPassword({
            email: details.email,
            password: details.password,
        })
        if (error) {
            toast.error('Something went wrong')
            console.log(error)
            return;
        }
        if (data) {
            toast.success('User LoggedIn Successfully')
            // console.log(data);
            setTimeout(() => {
                navigate('/')
                // reload the page
                window.location.reload();


            }, 1);
        }

    }

    const GoogleAuth = async (e) => {
        e.preventDefault();
        console.log('google auth');
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google'
        })

        if (error) {
            toast.error('Something went wrong')
            console.log(error)
            return;
        }
        if (data) {
            toast.success('User LoggedIn Successfully')
            console.log(data);
            // setTimeout(() => {
            //     navigate('/')
            //     // reload the page
            //     window.location.reload();

            // }, 1);
        }



    }



    return (
        <Container>
            <Typography variant="h4" component="h2" align='center' gutterBottom>
                Login
            </Typography>
            <form onSubmit={handleSubmit} >
                <TextField
                    color='secondary'
                    // style={field}
                    style={props.mode === 'dark' ? { marginBottom: 20, marginTop: 20, display: 'block', backgroundColor: '#fff', color: '#fff' } : { marginBottom: 20, marginTop: 20, display: 'block' }
                    }
                    fullWidth
                    required
                    id="email"
                    label="Enter Email"
                    variant="standard"
                    autoComplete='off'
                    onChange={(e) => { setDetails({ ...details, email: e.target.value }) }}
                />
                <TextField
                    color='secondary'
                    style={props.mode === 'dark' ? { marginBottom: 20, marginTop: 20, display: 'block', backgroundColor: '#fff', color: '#fff' } : { marginBottom: 20, marginTop: 20, display: 'block' }
                    }
                    type='password'
                    fullWidth
                    required
                    id="pass"
                    label="Enter Password"
                    variant="standard"
                    onChange={(e) => { setDetails({ ...details, password: e.target.value }) }}
                />

                <Button
                    // style={btn}
                    type='submit'
                    color='primary'
                    variant='contained'
                    endIcon={<KeyboardArrowRightOutlinedIcon />}
                    style={{margin:'10px 10px'}}
                >
                    Submit
                </Button>
                <Button
                    // style={btn}
                    type='button'
                    color='primary'
                    variant='contained'
                    onClick={GoogleAuth}
                    endIcon={<GoogleIcon />}
                >
                   Login with
                </Button>



            </form>
            <ToastContainer />
        </Container>

    )
}

export default Login