import React from 'react';
import style from './Login.module.css';
import RecentConnections from './RecentConnections.js';
import LoginForm from './LoginForm.js'

const LogIn = () => {
  return (
    <div className={style.container}>
      <RecentConnections />
      <LoginForm />
    </div>
  )
}

export default LogIn;