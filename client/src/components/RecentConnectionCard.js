import React from 'react'
import { Button, Card, CardContent, CardMedia, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import style from './RecentConnectionCard.module.css';
import Icon from '@mui/material/Icon';


const RecentConnectionCard = ({ userExist }) => {
    console.log(userExist.isThere);
    return (
        <div className={style.containsCard}>
            <Card className={style.card} sx={{ width: 150 }}>
                {userExist.isThere ?
                    <Button sx={{ width: 150, height: 30, fontSize: 10 }} variant="outlined" startIcon={<DeleteIcon />}>
                        Remove account
                    </Button> :
                    <Button sx={{ width: 150, height: 30, fontSize: 10 }} variant="outlined" startIcon={<Icon color="primary">add_circle</Icon>}>
                        Add account
                    </Button>}
                <CardMedia
                    component="img"
                    height="150"
                    image={`${userExist.img}`}
                    alt="man pic">
                </CardMedia>
                <CardContent sx={{ height: 20, display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                        {`${userExist.name}`}
                    </Typography>
                </CardContent>
            </Card>
        </div>
    )
}

export default RecentConnectionCard;