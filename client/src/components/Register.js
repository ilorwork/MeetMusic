import { Button, Paper, TextField } from '@mui/material';
import React from 'react';
import style from './Register.module.css';

const Register = () => {
  return (
    <div className={style.connection}>
    <Paper elevation={3} sx={{ width: 400, height: 400, padding: "0 8px" }}>
      <div className={style.inputs}>
        <div className={style.names}> 
        <TextField id="outlined-basic" label="First name" variant="outlined" sx={{marginRight: 2}}/>
        <TextField id="outlined-basic" label="Last name" variant="outlined"/>
        </div>
        <TextField id="outlined-basic" label="Email or phone number" variant="outlined"/>
        <TextField id="outlined-basic" label="New password" variant="outlined" />
        <Button variant="contained">Create a new account</Button>
        <div className={style.createAccount}>
          <Button variant="contained" color="success" sx={{ width: 300 }}>Connect</Button>
        </div>
      </div>
    </Paper>
  </div>
  )
}

export default Register;