import React from 'react'
import { useParams } from 'react-router-dom'
import supabase from '../config/SupabaseClient'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Typography from '@mui/material/Typography';
import { Button, TextField, Container } from '@mui/material'
import Chip from '@mui/material/Chip';

import Box from '@mui/material/Box';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import loading from '../loading.gif'

function Chat() {
    const navigate = useNavigate();
    const { id } = useParams()
    const [senderid, setSenderid] = useState('')
    const [receiverid, setReceiverid] = useState('')
    const [msg, setMsg] = useState('');
    const [chat, setChat] = useState([]);
    const [loader, setLoader] = useState(true);
    const Verify = async (sid) => {
        const { data, error } = await supabase
            .from('Request')
            .select()
            .eq('id', id)
        if (error) {
            console.log(error);
        }
        else {
            // console.log(data);
            if (data[0].request_from === sid || data[0].request_to === sid) {

                if (data[0].request_from === sid) {
                    setReceiverid(data[0].request_to);
                    fetchChats(sid, data[0].request_to);


                }
                else {
                    setReceiverid(data[0].request_from);
                    fetchChats(sid, data[0].request_from);
                }
                // console.log('true');
            }
            else {
                alert('You are not allowed to chat with this user');
                navigate('/msg');

            }
        }
    }
    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                // console.log(user);
                setSenderid(user.id);

                Verify(user.id);



            }
            else {
                navigate('/login');

            }
        }
        fetchUser();



        // eslint-disable-next-line
    }, [])
    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log(msg);
        const { data, error } = await supabase
            .from('messages')
            .insert({ request_from: senderid, request_to: receiverid, msg: msg })
            .select()
        if (error) {
            console.log(error);
            return;
        }
        if (data) {
            toast.success('Message sent');
            setMsg('');
            fetchChats(senderid, receiverid);

        }
    }

    const fetchChats = async (sid, rid) => {
        setLoader(true);
        const { data, error } = await supabase
            .from('messages')
            .select()
            .or(`and(request_from.eq.${sid},request_to.eq.${rid}),and(request_from.eq.${rid},request_to.eq.${sid}))`)
            .order('created_at', { ascending: true })
        if (error) {
            console.log(error);
        }
        else {
            // console.log(data);
            setChat(data);
            setLoader(false);
            handleSeen(sid, rid);
        }
    }

    const handleSeen = async (sid, rid) => {
        const { error } = await supabase
            .from('messages')
            .update({ status: 'seen' })
            .match({ request_from: rid, request_to: sid, status: 'unseen' })
        if (error) {
            console.log(error);
        }

    }




    return (
        <Container>
            {loader &&

                <div style={{ textAlign: 'center' }}>
                    <img className='my-3' src={loading} alt="loading" width='35px' />
                </div>

            }
            {!loader && <Box
                sx={
                    {
                        display: 'flex',
                        flexDirection: 'column',
                        // alignItems: 'center',
                        justifyContent: 'center',
                        height: 'auto'

                    }
                }
            >
                <form onSubmit={handleSubmit}>
                    <TextField
                        color='primary'
                        sx={{
                            position: 'fixed', bottom: 0, marginBottom: 2, width: 'auto'


                        }}
                        type='text'
                        fullWidth
                        error={msg === '' ? true : false}
                        required
                        id="msg"
                        label="Enter message"
                        variant="filled"
                        onChange={(e) => setMsg(e.target.value)}
                        value={msg}
                        InputProps={{
                            endAdornment: (
                                <>


                                    <RefreshOutlinedIcon
                                        sx={{ cursor: 'pointer', marginRight: 2 }}
                                        onClick={() => fetchChats(senderid, receiverid)}
                                    />

                                    <Button
                                        type='submit'
                                        color='primary'
                                        variant='contained'
                                    >
                                        Send
                                    </Button>
                                </>
                            )




                        }}
                    />


                </form>


                {chat.map((item, index) => {
                    return (

                        <div key={item.id}>


                            <Typography variant='h6' sx={{ color: "black" }} align='center'>
                                {
                                    index === 0 ? (item.created_at).slice(0, 10) : (item.created_at).slice(0, 10) === (chat[index - 1]?.created_at).slice(0, 10) ? null : (item.created_at).slice(0, 10)}


                            </Typography>
                            {
                                item.request_from === senderid ?

                                    <Typography variant='h6' color='primary' align='right'>
                                        {item.msg}
                                        <br />

                                        <Chip label={(item.time).slice(0, 5)} />
                                        <br />
                                        




                                        {item.status === 'seen' && <Chip label='Seen' sx={{backgroundColor:"transparent"}} />}

                                    </Typography>


                                    :
                                    <Typography variant='h6' color='primary' align='left'>
                                        {item.msg}
                                        <br />
                                        <Chip label={(item.time).slice(0, 5)} />
                                        


                                    </Typography>

                            }
                        </div>
                    )
                })}
            </Box>}
            <ToastContainer />

        </Container>
    )
}

export default Chat