import React from 'react'
import { useParams } from 'react-router-dom'
import supabase from '../config/SupabaseClient'
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import updateSeen from '../composables/UpdateSeen';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { Button, TextField, Container } from '@mui/material'
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Avatar } from '@mui/material';
import format from 'date-fns/format';
import CustomizedMenus from '../composables/Menus';
import SendIcon from '@mui/icons-material/Send';
import drkthemeloader from '../loading3.gif';
import lythemeloader from '../loading2.gif';
import RemoveEmoji from '../composables/RemoveEmoji';
import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import BlockIcon from '@mui/icons-material/Block';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import Tooltip from '@mui/material/Tooltip';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import FormControl from '@mui/material/FormControl';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 300,
    bgcolor: 'background.paper',
    border: '1px solid #000',
    boxShadow: 24,
    p: 4,
    borderRadius: 3
};

function Chat(props) {
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
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [blockstatus, setBlockstatus] = useState(false);
    const [blockby, setBlockby] = useState('');
    const [isrepoted, setIsreported] = useState(false);

    const [open2, setOpen2] = React.useState(false);
    const handleOpen2 = () => setOpen2(true);
    const handleClose2 = () => setOpen2(false);

    const [open3, setOpen3] = React.useState(false);
    const [value, setValue] = React.useState(null);

    const handleOpen3 = () => setOpen3(true);
    const handleClose3 = () => setOpen3(false);
    const reportUser = async () => {
        console.log(value);
        const { error } = await supabase
            .from('Report')
            .insert({ report_from: senderid, report_to: receiverid, reason: value })

        if (error) {
            console.log(error);
        }
        else {
            toast.success('User reported');
        }

        handleClose3();
    }
    const checkReport = async () => {
        const { data, error } = await supabase
            .from('Report')
            .select()
            .eq('report_from', senderid)
            .eq('report_to', receiverid)
        if (error) {
            console.log(error);
        }
        else {
            if (data.length > 0) {
                setIsreported(true);
            }
        }

    }

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

                if (data[0].block_status === true) {
                    setBlockstatus(true);
                    setBlockby(data[0].block_by);
                    toast.error('You cannot send message to this user');
                    // navigate('/msg');
                }

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
            updateSeen(sid);





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



        const newtime = new Date().toLocaleTimeString([], { hour12: false });
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
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const blockuser = async () => {
        if (window.confirm('Are you sure you want to block this user?')) {


            const { error } = await supabase
                .from('Request')
                .update({ block_by: senderid, block_status: true })
                .or(`and(request_from.eq.${senderid},request_to.eq.${receiverid}),and(request_from.eq.${receiverid},request_to.eq.${senderid}))`)
            if (error) {
                console.log(error);
            }
            else {
                toast.success('User blocked');
                window.location.reload();

            }
        }


    }
    const unblockuser = async () => {
        const { error } = await supabase
            .from('Request')
            .update({ block_by: null, block_status: false })
            .or(`and(request_from.eq.${senderid},request_to.eq.${receiverid}),and(request_from.eq.${receiverid},request_to.eq.${senderid}))`)
        if (error) {
            console.log(error);
        }
        else {
            toast.success('User unblocked');
            window.location.reload();

        }
    }

    const UnfriendUser = async () => {

        if (window.confirm('Are you sure you want to unfriend this user?')) {




            const { error } = await supabase
                .from('Request')
                .delete()
                .or(`and(request_from.eq.${senderid},request_to.eq.${receiverid}),and(request_from.eq.${receiverid},request_to.eq.${senderid}))`)

            if (error) {
                console.log(error);
            }
            else {
                toast.success('User unfriended');
                navigate('/msg');
            }
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
                    <img className='my-3' src={
                        props.mode === 'dark' ? drkthemeloader : lythemeloader
                    } alt="loading" width='35px' />
                </div>

            }
            {!loader &&
                <>
                    <div style={{ textAlign: 'center' }} >
                        <IconButton
                            onClick={handleClick}
                            size="small"
                            aria-controls={open ? 'account-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                        >
                            <Avatar alt="Ansh" align='center' src="/60111.jpg" sx={{ width: 56, height: 56, margin: 'auto' }} />
                        </IconButton>
                    </div>

                    <div style={{ textAlign: 'center' }} >
                        <h3>
                            {receivername}
                            <Chip sx={{ marginLeft: 1 }} color='success' size='small' label={lastseen} />

                        </h3>

                    </div>
                    <div>
                        <Modal
                            aria-labelledby="transition-modal-title"
                            aria-describedby="transition-modal-description"
                            open={open2}
                            onClose={handleClose2}
                            closeAfterTransition
                            slots={{ backdrop: Backdrop }}
                            slotProps={{
                                backdrop: {
                                    timeout: 500,
                                },
                            }}
                        >
                            <Fade in={open2}>
                                <Box sx={style}>

                                    <Avatar alt="Ansh" align='center' src="/60111.jpg" sx={{ width: 56, height: 56, margin: 'auto' }} />

                                    <div style={{ textAlign: 'center' }} >
                                        <h3>
                                            {receivername}
                                            <br />
                                            <Tooltip title='Unfriend' placement='top'>
                                                <PersonRemoveIcon className='profile-icon' sx={{ cursor: 'pointer', margin: '2px 8px' }} onClick={UnfriendUser} />
                                            </Tooltip>
                                            {!blockstatus && <Tooltip title='Block' placement='top'>
                                                <BlockIcon className='profile-icon' sx={{ cursor: 'pointer', margin: '2px 8px' }}
                                                    onClick={() => {
                                                        blockuser();
                                                        handleClose2();
                                                    }}
                                                />
                                            </Tooltip>}
                                            {blockstatus && blockby === senderid
                                                && <Tooltip title='Unblock' placement='top'>
                                                    <LockOpenIcon className='profile-icon' sx={{ cursor: 'pointer', margin: '2px 8px' }} onClick={unblockuser} />
                                                </Tooltip>
                                            }
                                            <Tooltip title='Report' placement='top'>
                                                <ReportProblemIcon className='profile-icon' sx={{ cursor: 'pointer', margin: '2px 8px' }}
                                                    onClick={() => {
                                                        checkReport();
                                                        handleOpen3();
                                                        handleClose2();
                                                    }
                                                    } />
                                            </Tooltip>
                                        </h3>

                                    </div>
                                </Box>
                            </Fade>
                        </Modal>
                    </div>
                    <div>
                        <Modal
                            aria-labelledby="transition-modal-title"
                            aria-describedby="transition-modal-description"
                            open={open3}
                            onClose={handleClose3}
                            closeAfterTransition
                            slots={{ backdrop: Backdrop }}
                            slotProps={{
                                backdrop: {
                                    timeout: 500,
                                },
                            }}
                        >
                            <Fade in={open3}>
                                <Box sx={style}>
                                    <h4 style={{ textAlign: 'center' }}>Report User</h4>
                                    {!isrepoted && <FormControl>
                                        <RadioGroup
                                            aria-labelledby="demo-radio-buttons-group-label"
                                            defaultValue="female"
                                            name="radio-buttons-group"
                                            value={value}
                                            onChange={(e) => setValue(e.target.value)}
                                        >
                                            <FormControlLabel value="Nudity or sexual activity" control={<Radio />} label="
                                    Nudity or sexual activity" />

                                            <FormControlLabel value="Hate speech or symbols" control={<Radio />} label="
                                    Hate speech or symbols" />

                                            <FormControlLabel value="Violence or dangerous organizations" control={<Radio />} label="
                                    Violence or dangerous organizations" />

                                            <FormControlLabel value="Harassment or bullying" control={<Radio />} label="
                                    Harassment or bullying" />

                                            <FormControlLabel value="Sale or promotion of illegal or regulated goods" control={<Radio />} label="
                                    Sale or promotion of illegal or regulated goods" />

                                            <FormControlLabel value="Self-harm" control={<Radio />} label="

                                    Self-harm" />
                                            <FormControlLabel value="Other" control={<Radio />} label="Other" />


                                        </RadioGroup>
                                        {value && <Button variant="contained" onClick={reportUser} style={{ backgroundColor: '#1976d2', color: '#fff', marginTop: '10px' }}>Report</Button>}
                                    </FormControl>}
                                    {isrepoted && <Typography variant='h6' align='center' sx={{ color: 'red' }}>You already reported this user</Typography>}

                                </Box>
                            </Fade>
                        </Modal>
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
                        {!blockstatus && <form onSubmit={handleSubmit}>
                            <TextField
                                color='primary'
                                sx={{
                                    position: 'fixed', bottom: 0, marginBottom: 2, width: 'auto',
                                    backgroundColor: props.mode === 'dark' ? '#424242' : '#fff'


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
                                                <SendIcon />
                                            </Button>
                                        </>
                                    )




                                }}
                            />


                        </form>}


                        {chat.map((item, index) => {

                            return (

                                (item.status !== 'seen' || (new Date().getTime() - new Date(item.created_at).getTime())+19800000 < 60000)
                                 && <div key={item.id}>


                                    <Typography variant='h6' sx={{ color: "black" }} align='center'>
                                        {
                                            index === 0 ? <Chip size='medium' color={
                                                props.mode === 'dark' ? 'success' : 'primary'
                                            } label={(item.created_at).slice(0, 10)} /> : (item.created_at).slice(0, 10) === (chat[index - 1]?.created_at).slice(0, 10) ? null : <Chip size='medium'
                                                color={
                                                    props.mode === 'dark' ? 'success' : 'primary'
                                                }
                                                label={(item.created_at).slice(0, 10)} />}



                                    </Typography>
                                    {
                                        item.request_from === senderid ?

                                            <Typography variant='h6' color='primary' align='right'

                                            // onMouseOver={() =>document.getElementById(item.id).style.display='revert'}
                                            >
                                                <span onMouseOver={
                                                    () => {
                                                        document.getElementById(item.id).style.display = 'revert'
                                                        document.getElementById(item.id).style.color = props.mode === 'dark' ? '#fff' : '#000'
                                                    }

                                                }
                                                    onMouseOut={() => document.getElementById(item.id).style.display = 'none'}
                                                >

                                                    <CustomizedMenus id={item.id} msg={item.msg} sender={true} />
                                                    {item.reaction_emoji && <Badge color={
                                                        props.mode === 'dark' ? 'success' : 'primary'
                                                    } badgeContent={item.reaction_emoji} sx={{ marginBottom: 1 }}
                                                        anchorOrigin={{
                                                            vertical: 'bottom',
                                                            horizontal: 'right',
                                                        }}
                                                    >

                                                        {item.msg}
                                                    </Badge>}
                                                    {!item.reaction_emoji && <>{item.msg}</>}


                                                </span>

                                                <br />

                                                <Chip label={(item.time).slice(0, 5)}
                                                    color={
                                                        props.mode === 'dark' ? 'primary' : 'success'
                                                    }
                                                />
                                                <br />





                                                {item.status === 'seen' && <Chip label='Seen'
                                                    sx={props.mode === 'dark' ? { backgroundColor: 'transparent', color: '#fff' } : { backgroundColor: 'transparent', color: '#000' }
                                                    }
                                                />}

                                            </Typography>


                                            :
                                            <Typography variant='h6' color='primary' align='left'>
                                                <span onMouseOver={() => {
                                                    document.getElementById(item.id).style.display = 'revert'
                                                    document.getElementById(item.id).style.color = props.mode === 'dark' ? '#fff' : '#000'
                                                }
                                                }
                                                    onMouseOut={() => document.getElementById(item.id).style.display = 'none'}
                                                >
                                                    {item.reaction_emoji && <Badge color={
                                                        props.mode === 'dark' ? 'success' : 'primary'
                                                    } badgeContent={item.reaction_emoji} sx={{
                                                        marginBottom: 1,
                                                        cursor: 'pointer'
                                                    }}
                                                        anchorOrigin={{
                                                            vertical: 'bottom',
                                                            horizontal: 'left',

                                                        }}
                                                        onClick={() =>
                                                            RemoveEmoji(item.id)
                                                        }

                                                    >

                                                        {item.msg}
                                                    </Badge>}
                                                    {!item.reaction_emoji && <>{item.msg}</>}

                                                    <CustomizedMenus mode={props.mode} id={item.id} msg={item.msg} sender={false} />
                                                </span>

                                                <br />
                                                <Chip
                                                    color={
                                                        props.mode === 'dark' ? 'primary' : 'success'
                                                    }
                                                    label={(item.time).slice(0, 5)} />



                                            </Typography>

                                    }
                                </div>
                            )
                        })}
                        {blockstatus && blockby !== senderid && <Typography variant='h6' color='primary' align='center'>
                            <Chip label='You are blocked by this user' sx={{ backgroundColor: "transparent" }} />




                        </Typography>}
                        {blockby === senderid && <Typography variant='h6' color='primary' align='center'>
                            <Chip label='You blocked this user' sx={{ backgroundColor: "transparent" }} />
                            <Button variant='contained' color='primary' onClick={unblockuser}>Unblock</Button>
                        </Typography>

                        }
                    </Box>
                </>}
            <ToastContainer />
            {/* scroll to the bottem of the page */}

            <div
                style={{ float: "left", clear: "both" }}
                ref={messagesEndRef}

            ></div>

            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={
                    () => {

                        handleOpen2()
                    }


                }>
                    View Profile
                </MenuItem>

                <MenuItem onClick={UnfriendUser}>
                    Unfriend
                </MenuItem>
                {!blockstatus && <MenuItem onClick={blockuser}>
                    Block
                </MenuItem>}

                {
                    blockby === senderid && <MenuItem onClick={unblockuser}>
                        Unblock
                    </MenuItem>

                }

            </Menu>

        </Container>
    )
}

export default Chat