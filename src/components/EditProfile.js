import React from 'react'
import { Avatar } from '@mui/material';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';

import supabase from '../config/SupabaseClient';
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function EditProfile(props) {
    const navigate = useNavigate()
    const [details, setDetails] = useState({ name: '', email: '' })
    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setDetails({ name: user.user_metadata.username, email: user.email })
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
            <div >

                <Avatar alt="Ansh" align='center' src="/60111.jpg" sx={{ width: 120, height: 120, margin: 'auto' }} />


                <TextField id="standard-basic" label="Name" variant="standard" margin='dense' fullWidth required value={details.name} disabled
                    style={props.mode === 'dark' ? { marginBottom: 20, marginTop: 20, display: 'block', backgroundColor: '#fff', color: '#fff' } : { marginBottom: 20, marginTop: 20, display: 'block' }
                    }
                />
                <TextField id="standard-basic" label="Email" variant="standard" margin='dense' fullWidth required value={details.email} disabled
                    style={props.mode === 'dark' ? { marginBottom: 20, marginTop: 20, display: 'block', backgroundColor: '#fff', color: '#fff' } : { marginBottom: 20, marginTop: 20, display: 'block' }
                    }
                />
                <Button
                    // style={btn}
                    type='submit'
                    color='primary'
                    variant='contained'
                    endIcon={<KeyboardArrowRightOutlinedIcon />}
                    sx={{ marginTop: '10px' }}
                >
                    Save & Update
                </Button>


            </div>

        </>
    )
}

export default EditProfile