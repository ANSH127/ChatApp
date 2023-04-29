import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Grid, Avatar, Button } from '@mui/material';

import Typography from '@mui/material/Typography';
import { useState, useEffect } from 'react';
import supabase from '../config/SupabaseClient';
import { useNavigate } from 'react-router-dom';
import loading from '../loading.gif' 

export default function AddFriend() {
    const [list, setList] = useState([]);
    const [userid, setUserid] = useState('');
    const [loader, setLoader] = useState(true);
    const navigate = useNavigate();
    const fetchRecord = async (id) => {

        const { data, error } = await supabase
            .from('Users')
            .select()
            .neq('user_id', id)
        if (error) {
            console.log(error);
        }
        else {
            const requestdata = await fetchRequest(id);
            // console.log(requestdata);
            const filterdata = data.filter((item) => {
                return requestdata.filter((item2) => {
                    return item.user_id === item2.request_to || item.user_id === item2.request_from
                }).length === 0
            })
            // console.log('filter data',filterdata);
            setList(filterdata);
            setLoader(false);
            // console.log(data);
        }
    }
    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                // console.log(user);
                setUserid(user.id);
                fetchRecord(user.id);
            }
            else {
                navigate('/login');

            }
        }
        fetchUser();



        // eslint-disable-next-line
    }, [])

    const fetchRequest = async (id) => {
        const { data, error } = await supabase
            .from('Request')
            .select()
            .or(`request_from.eq.${id},request_to.eq.${id}`)
        if (error) {
            console.log(error);
        }
        else {
            return data;
        }
    }


    const SentRequest = async (id) => {
        // console.log('id', id);
        const { data, error } = await supabase
            .from('Request')
            .insert({ request_from: userid, request_to: id })
            .select()
        if (error) {
            console.log(error);
            return;
        }
        if(data){
            alert('Request Sent');
            fetchRecord(userid);
        }
    }






    return (
        <>
        {loader &&
        
      <div style={{textAlign:'center'}}>
      <img className='my-3' src={loading} alt="loading" width='35px' />
  </div>
        }
        {!loader && <Grid container spacing={2}>

            {list.map((item, index) => {


                return <Grid item xs={12} sm={6} md={3} key={index} >
                    <Card sx={{ display: 'flex' }}  >
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <CardContent sx={{ flex: '1 0 auto' }}>
                                <Typography component="div" variant="h5">

                                    <Avatar alt="Remy Sharp" src="/60111.jpg" sx={{ ml: 2 }} />
                                    {item.username}

                                </Typography>
                                <Typography varient="h6" component="div">

                                    <Button variant="contained" size='small' color="primary"
                                        onClick={() => SentRequest(item.user_id)}
                                    >
                                        Add Friend
                                    </Button>
                                </Typography>

                            </CardContent>

                        </Box>

                    </Card>
                </Grid>
            })};

        </Grid>}

        </>
    );
}