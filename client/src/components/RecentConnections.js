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
        img: "https://lh3.googleusercontent.com/Y1eRiZFvzI3N8LjjWvd6DDPbpqt5MmEb1cRi0Zr13Ju7MaXFtBh5VkUc-1PBLtz98Fs3hGe49dW6kofxC_y-YPKJr5vmJJcQfVPtbsuJ04DSH_je0bpVTfb-cbWVFWatQX-Ytp4_XGrUCmuww0vj7SvzUR_PwEF1wApGK6LwpiLuHreS1P5IKw_z3gAlTs717oGngfCJMK_CDfLo_ggyggYyCoBAmvKjwJJfj3ucIfxTg7GB8Hl6_StXeqdOCDmP39ySbMUEHGe9245PHTY2HSoRxO__1Ar5nYCXYay5gUAraOlmhJOxOZtaenlHNzGekqecC-GtZ6OQvsrUbVpDlMxqqbcUrgWOQ53ZXX8jNW5y7fDSIlresk2eXiEzuZSR0_mEbhwD2WD3D_JEAqC_o0yLyKtIMPnQ7vcOqxlmxL-TLvQB4oFKDsti9ph07qGfvMCpD7JHeEQhf7n61BNumbo1IbaK6a86iU9bEQr5XVntszrlpXRl7X0q8sDRCLCbdUFGnB4lSaqT-V8qS7gE2112GKTmEzywwtS7ne_tnFGh3k3F4wX8eqSO8yiLvIsGZL3XAlTUr7d7ozfOce0-DHMM6-27X6xBQQrhPm9l39IRSt0lg3qUppRthb3ktUA-zVIYHo6ntt04ZqJPBePJ4FYDOC0JIkofRKJCHI_gWO83ofZdEWJDmJwUxAAqGkdANZoCX7_M7U8HidwRIWoEbzEumz3Ky2rwozLNWMUWxk6HxzYsuyQcHGP5PHdzh34RKadyZxEYVjZbq-9UG7X9KGQ-uT9-7Qj8ucqQ1TnN8t9W7fRfGSHCS6fw1PaNgI6v01kyRgXyNS_3e5h1xbhxgOENdchAqv03zXCJr-0=w822-h820-no?authuser=4",
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