import { Button, Paper, TextField } from '@mui/material';
import React from 'react'
import style from './LoginForm.module.css';

const LoginForm = () => {
  return (
    <div className={style.connection}>
      <Paper elevation={3} sx={{ width: 400, height: 400, px: "8px" }}>
        <div className={style.inputs}>
          <TextField label="Email or phone number" variant="outlined" autoFocus/>
          <TextField label="Password" variant="outlined" />
          <Button variant="contained">Connect</Button>
          <div className={style.createAccount}>
            <Button variant="contained" color="success" sx={{ width: 300 }}>Create a new account</Button>
          </div>
        </div>
      </Paper>
    </div>
  )
}

export default LoginForm;