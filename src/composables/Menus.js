import React from 'react'
import { styled, alpha } from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import Grid from '@mui/material/Grid';

import supabase from '../config/SupabaseClient';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.3),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));

export default function CustomizedMenus(props) {
  // console.log(props.id);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(props.msg);
    handleClose();
    toast.success('Copied to Clipboard')
  }

  const deleteMsg = async () => {

    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', props.id)

    if (error) {
      toast.error('Something went wrong')
      console.log(error)
      return;
    }
    toast.success('Message Deleted')


    handleClose();
  }
  const handleEmoji = async (emoji) => {
    let moji = ''
    if (emoji === '&#128512;') {
      moji = '😀';

    }
    else if (emoji === '&#128514;') {
      moji = '😂';

    }
    else if (emoji === '&#128077;') {
      moji = '👍';

    }
    else if (emoji === '&#128151;') {
      moji = '💗';

    }
    const { error } = await supabase
      .from('messages')
      .update({ reaction_emoji: moji })
      .eq('id', props.id)

    if (error) {
      toast.error('Something went wrong')
      console.log(error)
      return;
    }
    toast.success('Emoji Added')



    handleClose();

  }


  return (
    <>
      <IconButton
        aria-label="more"
        id={props.id}
        aria-controls={open ? 'demo-customized-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        sx={{ display: 'none' }}
        onClick={handleClick}
      >
        <MoreVertIcon fontSize='small' />
      </IconButton>

      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {!props.sender && <MenuItem onClick={handleClose} disableRipple>
          <Grid container >
            <Grid item xs={3} md={3} className='emoji' id='laughingemoji' onClick={
              () =>
                handleEmoji('&#128512;')
            } >
              &#128512;
            </Grid>
            <Grid item xs={3} md={3} className='emoji' onClick={
              () =>
                handleEmoji('&#128514;')
            } >
              &#128514;

            </Grid>
            <Grid item xs={3} md={3} className='emoji' onClick={
              () =>
                handleEmoji('&#128077;')
            } >
              &#128077;

            </Grid>
            <Grid item xs={3} md={3} className='emoji' onClick={
              () =>
                handleEmoji('&#128151;')
            } >


              &#128151;
            </Grid>
          </Grid>

        </MenuItem>}
        <MenuItem onClick={copyToClipboard} disableRipple>
          <ContentCopyOutlinedIcon fontSize='small' />
          Copy
        </MenuItem>
        {props.sender && <MenuItem onClick={deleteMsg} disableRipple>
          <DeleteOutlineOutlinedIcon fontSize='small' />
          Unsend

        </MenuItem>}

      </StyledMenu>
    </>
  );
}