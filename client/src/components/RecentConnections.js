import { Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import RecentConnectionCard from './RecentConnectionCard';
import style from './RecentConnections.module.css';

const RecentConnections = () => {
    const [userExist, setUserExist] = useState({
        isThere: true,
        img: "https://images.pexels.com/photos/874158/pexels-photo-874158.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        name: "miki"
    });
    const [userNoExist, setUserNoExist] = useState({
        isThere: false,
        img: "https://images.pexels.com/photos/1549004/pexels-photo-1549004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        name: ""
    });

    return (
        <div className={style.wrapper}>
            <h1><span className={style.h1}>MeetMusic</span></h1>
            <h2 className={style.h2}>recent connections</h2>
            <p className={style.p}>click your photo to sign in or add an account</p>
            <Grid container
                direction="row"
                justifyContent="center"
                alignItems="center"
                sx={{ mt: 4 }}>
                <Grid item lg={4}>
                    {userExist.isThere && <RecentConnectionCard userExist={userExist} />}
                </Grid>
                <Grid item lg={4}>
                    {userExist.isThere && <RecentConnectionCard userExist={userExist} />}
                </Grid>
                <Grid item lg={4}>
                    <RecentConnectionCard userExist={userNoExist} />
                </Grid>
            </Grid>
        </div >
    )
}

export default RecentConnections;