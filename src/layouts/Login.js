import React from 'react'
import { Button } from 'react-bootstrap'
import {Grid,Paper} from '@material-ui/core'
import { Avatar, TextField } from '@mui/material'
//import SmartToyOutlinedIcon from '@mui/icons-material';
import '../App.css';
import { Navigate } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

const Login = () => {

    const pStyle = {
        padding:20, 
        height: '70vh', 
        width: 320, 
        margin: "-120px 0 0 0", 
        'max-height': 300, 
        'text-align': 'center',
        'position': 'absolute',
        'top': '50%',
        'left': '50%',
        '-ms-transform': 'translate(-50%, -50%)',
        'transform': 'translate(-50%, -50%)'
    }
    const aStyle = {backgroundColor: 'blue'}
    const bStyle = {
        backgroundColor: 'transparent',
        color: '#00FF29',
        fontSize: '20px',
        borderRadius: '5px',
        margin: '10px',
        width: 200,
        textAlign: 'center',
        border: '1px solid #00FF29',
        padding: '5px 20px'
    }

    const navigate = useNavigate();

    const tStyle = {padding: '10px', width: 280}
    //<Avatar style = {aStyle}><SmartToyOutlinedIcon/></Avatar>

    return(
        <Grid>
            <Paper elevation = {10} style = {pStyle}>
                <Grid align = 'center'>
                    <h2>Connect To The Robot</h2>
                </Grid>
                <TextField  style = {tStyle} label = 'Robot ID' placeholder='Enter Robot ID' />
                <TextField  style = {tStyle} label = 'Password' placeholder='Enter Password' type = 'password'/>
                <Button onClick={() => navigate("/video-chat-page")} align = 'center' style = {bStyle} type = 'submit' variant = "contained" fullWidth required>Connect</Button>
            </Paper>
            <div class = "box"></div>
        </Grid>
    )
}

export default Login


