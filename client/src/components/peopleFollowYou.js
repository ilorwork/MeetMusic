import { Button } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import style from "./PeopleSideList.module.css";

const PeopleFollowYou = ({ user, userInfo }) => {
    const [isFollow, setIsFollow] = useState(false);

    const followersPeopleOfAnotherUser = user.followers;
    const idOfCurrentUser = `${userInfo._id}`;
    console.log(followersPeopleOfAnotherUser);
    console.log(idOfCurrentUser);

    useEffect(() => {
        setIsFollow(followersPeopleOfAnotherUser.includes(idOfCurrentUser));
    }, []);
    console.log(isFollow);

    const unFollowTheUser = async () => {
        const token = localStorage.getItem("token");
        const idOfUserFollowed = user._id;
        try {
            await axios.patch("http://localhost:7000/users/user/unfollow",
                { _id: idOfUserFollowed },
                {
                    withCredentials: true,
                    headers: {
                        authorization: token,
                    },
                });
        } catch (e) {
            throw new Error("unfollow another user failed " + e);
        }
    }

    const followTheUser = async () => {
        const token = localStorage.getItem("token");
        const idOfUserFollowed = user._id;
        try {
            await axios.patch("http://localhost:7000/users/user/follow",
                { _id: idOfUserFollowed },
                {
                    withCredentials: true,
                    headers: {
                        authorization: token,
                    },
                });
        } catch (e) {
            throw new Error("follow another user failed " + e);
        }
    }


    return (
        <>
            <div className={style.personCard}>
                <img
                    className={style.personPic}
                    width={70}
                    height={70}
                    src={user.profilePic}
                    alt="user profile pic"
                />
                <span className={style.personName}>{user.firstName} {user.lastName}</span>
                {isFollow &&
                    <Button style={{ background: "rgb(209, 46, 100)", fontSize: 10 }} variant="contained"
                        onClick={() => unFollowTheUser()}>
                        UnFollow
                    </Button>}
                {!isFollow && <Button style={{ background: "rgb(38, 165, 165)", fontSize: 10 }} variant="contained"
                    onClick={() => followTheUser()}>
                    Follow back
                </Button>}
            </div>
        </>
    );
};

export default PeopleFollowYou;
