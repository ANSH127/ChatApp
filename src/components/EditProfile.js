import React from 'react'
import { Avatar } from '@mui/material';
import TextField from '@mui/material/TextField';

import supabase from '../config/SupabaseClient';
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import { ToastContainer, toast } from 'react-toastify';
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';
function EditProfile(props) {
    const navigate = useNavigate()
    const [details, setDetails] = useState({ name: '', email: '' })
    const [edit, setEdit] = useState(false)
    const [edit2, setEdit2] = useState(false)
    const [isusername, setIsusername] = useState(true)
    const [currentuser, setCurrentuser] = useState(null)  // eslint-disable-next-line

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                console.log(user);
                setDetails({ name: user.user_metadata.username, email: user.email,id:user.id })
                setCurrentuser(user.user_metadata.username)
            }
            else {
                navigate('/login');

            }
        }
        fetchUser();
        // eslint-disable-next-line
    }, [])

    const emailedit = () => {
        document.getElementById('email').disabled = false;
        setDetails({ ...details, email: '' });
        setEdit(true);




    }
    const usernameedit = () => {
        document.getElementById('username').disabled = false;
        setDetails({ ...details, name: '' });
        setEdit2(true);
    }
    const checkusername = async (username) => {
        if (username.length < 4) {
            setIsusername(false);
            return;
        }
        const { data, error } = await supabase
            .from('Users')
            .select('username')
            .ilike('username', username)
        if (error) {
            toast.error('Something went wrong')
            console.log(error)
            return;
        }
        if (data.length > 0) {
            if (data[0].username===currentuser) {
                setIsusername(true);
                return;
            }
            setIsusername(false);
            return;
        }
        else {
            setIsusername(true);
        }

    }
    const updateMail = async () => {
        if (details.email.length < 1) {
            toast.error('Email cannot be empty')
            return;
        }

        const { data, error } = await supabase.auth.updateUser({ email: details.email })
        if (error) {
            toast.error('Something went wrong')
            console.log(error)
            return;
        }
        if (data) {

            toast.success('Email Verification link sent !')
            setEdit(false);
            // console.log(data);
            document.getElementById('email').disabled = true;
        }


    }
    const updateUsername = async () => {
        const { data, error } = await supabase.auth.updateUser({
            data: { username: details.name },
        })
        if (error) {
            toast.error('Something went wrong')
            console.log(error)
            return;
        }
        if (data) {

            toast.success('Username Updated Successfully')
            setEdit2(false);
            // console.log(data);
            document.getElementById('username').disabled = true;
            updateUserProfile();


        }


    }

    const updateUserProfile = async () => {
        const {error} =await supabase
        .from('Users')
        .update({username:details.name})
        .eq('user_id',details.id)
        if(error){
            toast.error('Something went wrong')
            console.log(error)
            return;
        }
        

    }

    return (
        <>
            <div >

                <Avatar alt="Ansh" align='center' src="/60111.jpg" sx={{ width: 120, height: 120, margin: 'auto' }} />


                <TextField
                    id="username"
                    label="Username"
                    variant="standard"
                    margin='dense'
                    fullWidth
                    required
                    value={details.name}
                    disabled
                    style={props.mode === 'dark' ? { marginBottom: 20, marginTop: 20, display: 'block', backgroundColor: '#fff', color: '#fff' } : { marginBottom: 20, marginTop: 20, display: 'block' }
                    }
                    onChange={(e) => {
                         setDetails({ ...details, name: e.target.value })
                         checkusername(e.target.value)

                         }}
                    InputProps={{
                        endAdornment: (
                            <>
                                
                                {isusername && <DoneIcon
                                    sx={{ cursor: 'pointer', marginRight: 2,color:'green' }}
                                    
                                />}

                                {!edit2 && <EditIcon
                                    sx={{ cursor: 'pointer', marginRight: 2 }}
                                    onClick={usernameedit}
                                />}
                                {!isusername && <ClearIcon
                                    sx={{ cursor: 'pointer', marginRight: 2,color:'red' }}

                                />}

                                {edit2 && isusername && 
                                currentuser!==details.name && 
                                 <Button
                                    variant="outlined"
                                    color="primary"
                                    size="small"
                                    onClick={updateUsername}

                                >
                                    Update

                                </Button>}
                            </>
                        )
                    }}


                />
                <TextField
                    id="email"
                    label="Email"
                    variant="standard"
                    margin='dense'
                    fullWidth
                    required
                    value={details.email}
                    onChange={(e) => { setDetails({ ...details, email: e.target.value }) }}
                    disabled
                    style={props.mode === 'dark' ? { marginBottom: 20, marginTop: 20, display: 'block', backgroundColor: '#fff', color: '#fff' } : { marginBottom: 20, marginTop: 20, display: 'block', color: '#000' }
                    }

                    InputProps={{
                        endAdornment: (
                            <>


                                {!edit && <EditIcon
                                    sx={{ cursor: 'pointer', marginRight: 2 }}
                                    onClick={emailedit}
                                />}
                                {edit && <Button
                                    variant="outlined"
                                    color="primary"
                                    size="small"
                                    onClick={updateMail}

                                >
                                    Update

                                </Button>}
                            </>
                        )
                    }}
                />


            </div>
            <ToastContainer />

        </>
    )
}

export default EditProfile