import React from 'react'
import { useParams } from 'react-router-dom'
import supabase from '../config/SupabaseClient'
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import Typography from '@mui/material/Typography';
import { Button, TextField, Container } from '@mui/material'
import Chip from '@mui/material/Chip';

import Box from '@mui/material/Box';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import loading from '../loading.gif'
import { Avatar } from '@mui/material';
import format from 'date-fns/format';
import CustomizedMenus from '../composables/Menus';



function Chat() {
    const navigate = useNavigate();
    const { id } = useParams()
    const [senderid, setSenderid] = useState('')
    const [receiverid, setReceiverid] = useState('')
    const [msg, setMsg] = useState('');
    const [chat, setChat] = useState([]);
    const [loader, setLoader] = useState(true);
    const [receivername, setReceivername] = useState('');
    const [lastseen, setLastseen] = useState('');
    const messagesEndRef = useRef(null);
    const Verify = async (sid) => {
        const { data, error } = await supabase
            .from('Request')
            .select()
            .eq('id', id)
        if (error) {
            console.log(error);
        }
        else if (data.length === 0) {
            alert('Something went wrong');
            navigate('/msg');
        }
        else {
            // console.log(data);
            if (data[0].request_from === sid || data[0].request_to === sid) {

                if (data[0].request_from === sid) {
                    setReceiverid(data[0].request_to);
                    fetchChats(sid, data[0].request_to);
                    recivername(data[0].request_to);



                }
                else {
                    setReceiverid(data[0].request_from);
                    fetchChats(sid, data[0].request_from);
                    recivername(data[0].request_from);
                }
                // console.log('true');
            }
            else {
                navigate('/msg');
                alert('Something went wrong')

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
    const scrolltoBottom = () => {
        if (messagesEndRef.current) {
            // console.log(messagesEndRef.current);
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }

    const fetchChats = async (sid, rid) => {

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
            scrolltoBottom();
            handleSeen(sid, rid);
            updateSeen();





            reciverlastseen(rid);
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
    const recivername = async (id) => {
        const { data, error } = await supabase
            .from('Users')
            .select('username')
            .eq('user_id', id)
        if (error) {
            console.log(error);
        }
        else {
            setReceivername(data[0].username);
        }
    }
    const updateSeen = async () => {
        const { error } = await supabase
            .from('Users')
            .update({ last_seen: new Date().toLocaleTimeString(), last_seen_date: format(new Date(), 'yyyy-MM-dd') })
            .eq('user_id', senderid)
        if (error) {
            console.log(error);
        }
    }
    const reciverlastseen = async (id) => {
        const { data, error } = await supabase
            .from('Users')
            .select('last_seen, last_seen_date')
            .eq('user_id', id)
        if (error) {
            console.log(error);
        }
        else {
            // console.log(data);
            setLastseen(timediff(data[0].last_seen, data[0].last_seen_date));
            // console.log(timediff(data[0].last_seen, data[0].last_seen_date));

        }
    }

    const timediff = (time, date) => {
        // console.log(time, date);
        const newdate = format(new Date(), 'yyyy-MM-dd');
        let date_diff = new Date(newdate) - new Date(date);
        // console.log(date_diff);
        date_diff = (Math.floor(date_diff / (1000 * 60 * 60 * 24)));
        // console.log(date_diff);



        const newtime = new Date().toLocaleTimeString([],{hour12:false});
        const t1 = time.split(':');
        const t2 = newtime.split(':');
        
        const h1 = parseInt(t1[0]);
        const m1 = parseInt(t1[1]);
        const h2 = parseInt(t2[0]);
        const m2 = parseInt(t2[1]);
        const diff = (h2 - h1) * 60 + (m2 - m1);
        // console.log(diff);
        if (date_diff === 0) {

            if (diff < 1) {
                return 'Online';
            }
            else {
                if (diff > 60) {
                    return `${Math.floor(diff / 60)} hours ago`;
                }

                else {
                    return `${diff} minutes ago`;
                }

            }
        }
        else if (date_diff === 1) {
            return 'Yesterday';
        }
        else {
            return `${date_diff} days ago`;
        }

    }

    // Supabase client setup
    // eslint-disable-next-line
    const channel = supabase
        .channel('changes')
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'messages',
                filter: `request_from=eq.${receiverid}`,
            },
            (payload) => {
                fetchChats(senderid, receiverid);
            }
        )
        .subscribe()





    return (
        <Container>
            {loader &&

                <div style={{ textAlign: 'center' }}>
                    <img className='my-3' src={loading} alt="loading" width='35px' />
                </div>

            }
            {!loader &&
                <>
                    <Avatar alt="Ansh" align='center' src="/60111.jpg" sx={{ width: 56, height: 56, margin: 'auto' }} />
                    <div style={{ textAlign: 'center' }} >
                        <h3>
                            {receivername}
                            <Chip sx={{ marginLeft: 1 }} color='success' size='small' label={lastseen} />

                        </h3>

                    </div>


                    <Box
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


                                            {/* <RefreshOutlinedIcon
                                                sx={{ cursor: 'pointer', marginRight: 2 }}
                                                onClick={() => fetchChats(senderid, receiverid)}
                                            /> */}

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
                                            index === 0 ? <Chip size='medium' label={(item.created_at).slice(0, 10)} /> : (item.created_at).slice(0, 10) === (chat[index - 1]?.created_at).slice(0, 10) ? null : <Chip size='medium' label={(item.created_at).slice(0, 10)} />}



                                    </Typography>
                                    {
                                        item.request_from === senderid ?

                                            <Typography variant='h6' color='primary' align='right'>
                                                <span>

                                             <CustomizedMenus id={item.id} msg={item.msg} />   {item.msg}
                                                </span>
                                                <br />

                                                <Chip label={(item.time).slice(0, 5)} />
                                                <br />





                                                {item.status === 'seen' && <Chip label='Seen' sx={{ backgroundColor: "transparent" }} />}

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
                    </Box>
                </>}
            <ToastContainer />
            {/* scroll to the bottem of the page */}

            <div
                style={{ float: "left", clear: "both" }}
                ref={messagesEndRef}

            ></div>

        </Container>
    )
}

export default Chat