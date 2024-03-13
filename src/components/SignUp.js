import React from 'react'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Typography, Button, TextField, Container } from '@mui/material'
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import { useState } from 'react';
import supabase from '../config/SupabaseClient';


function SignUp(props) {
    const [details, setDetails] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        username: ''

    });
    const insertUser = async (id,username) => {

        const { error } = await supabase
            .from('Users')
            .insert({ user_id: id, username: username})
        if (error) {
            console.log(error);
        }
        
    }

        const handleSubmit = async (e) => {
            e.preventDefault();
            if (details.password !== details.confirmPassword) {
                toast.error('Password does not match')
                return;
            }



            const { data, error } = await supabase.auth.signUp(
                {
                    email: details.email,
                    password: details.password,
                    options: {
                        data: {
                            username: details.username
                        }
                    }
                }
            )

            if (error) {
                toast.error('Something went wrong')
                console.log(error)
                return;
            }
            if (data) {
                toast.success('User Created Successfully')
                toast.warning('Email Verification Link Sent to your Email')
            }
            insertUser(data.user.id,data.user.user_metadata.username);





        }

        return (

            <Container>
                <Typography variant="h4" component="h2" align='center' gutterBottom>
                    SignUp
                </Typography>
                <form onSubmit={handleSubmit} >
                    <TextField
                        color='secondary'
                        style={props.mode === 'dark' ? { marginBottom: 20, marginTop: 20, display: 'block', backgroundColor: '#fff', color: '#fff' } : { marginBottom: 20, marginTop: 20, display: 'block' }
                    }
                        fullWidth
                        required
                        id="username"
                        label="Enter Username"
                        variant="standard"
                        onChange={(e) => { setDetails({ ...details, username: e.target.value }) }}
                    />
                    <TextField
                        color='secondary'
                        style={props.mode === 'dark' ? { marginBottom: 20, marginTop: 20, display: 'block', backgroundColor: '#fff', color: '#fff' } : { marginBottom: 20, marginTop: 20, display: 'block' }
                    }
                        fullWidth
                        required
                        id="email"
                        label="Enter Email"
                        variant="standard"
                        onChange={(e) => { setDetails({ ...details, email: e.target.value }) }}
                    />
                    <TextField
                        color='secondary'
                        style={props.mode === 'dark' ? { marginBottom: 20, marginTop: 20, display: 'block', backgroundColor: '#fff', color: '#fff' } : { marginBottom: 20, marginTop: 20, display: 'block' }
                    }
                        type='password'
                        fullWidth
                        required
                        id="password"
                        label="Enter Password"
                        variant="standard"
                        onChange={(e) => { setDetails({ ...details, password: e.target.value }) }}
                    />
                    <TextField
                        color='secondary'
                        style={props.mode === 'dark' ? { marginBottom: 20, marginTop: 20, display: 'block', backgroundColor: '#fff', color: '#fff' } : { marginBottom: 20, marginTop: 20, display: 'block' }
                    }
                        type='password'
                        fullWidth
                        required
                        id="confirmPassword"
                        label="Confirm Password"
                        variant="standard"
                        onChange={(e) => { setDetails({ ...details, confirmPassword: e.target.value }) }}
                    />
                    <Button
                        // style={btn}
                        type='submit'
                        color='primary'
                        variant='contained'
                        endIcon={<KeyboardArrowRightOutlinedIcon />}
                    >
                        Submit
                    </Button>


                </form>
                <ToastContainer />
            </Container>


        )
    }

    export default SignUp