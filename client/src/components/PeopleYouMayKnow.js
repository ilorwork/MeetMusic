import React from 'react'
import { Button } from '@mui/material';
import style from './PeopleYouMayKnow.module.css';

const PeopleYouMayKnow = () => {
    return (
        <div className={style.person}>
            <img className={style.personPic} width={70} height={70} src='https://images.unsplash.com/photo-1542740348-39501cd6e2b4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80' alt='girl' />
            <span className={style.personName}>Lian Levi</span>
            <div className={style.wrapperBtn}>
                <Button style={{ background: 'rgb(38, 165, 165)' }} variant="contained">Follow</Button>
            </div>
        </div>
    )
}

export default PeopleYouMayKnow