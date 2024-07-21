import { Card, CardContent, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import RecentConnectionCard from "./RecentConnectionCard";
import style from "./RecentConnections.module.css";
import cardStyle from "./RecentConnectionCard.module.css";
import { v4 as uuid } from "uuid";
import { useNavigate } from "react-router-dom";

const RecentConnections = () => {
  const [recentUsers, setRecentUsers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("recentConnections")) return;

    const recentConnections = JSON.parse(
      localStorage.getItem("recentConnections")
    );
    setRecentUsers(recentConnections);
  }, []);

  return (
    <div className={style.wrapper}>
      <Card className={style.logoCard} onClick={() => navigate("/about")}>
        <h1>
          <span className={style.h1}>MeetMusic</span>
        </h1>
      </Card>
      <h2 className={style.h2}>Recent Connections</h2>
      {recentUsers.length > 0 && (
        <p className={style.p}>Click your photo to sign in</p>
      )}
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        sx={{ mt: 4 }}
      >
        {recentUsers.map((user) => (
          <Grid key={uuid()} item lg={4}>
            <RecentConnectionCard user={user} setRecentUsers={setRecentUsers} />
          </Grid>
        ))}

        {!recentUsers.length && (
          <Grid item lg={4}>
            <div className={cardStyle.containsCard}>
              <Card className={cardStyle.card} sx={{ width: 150 }}>
                <CardContent
                  sx={{
                    height: 190,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography sx={{ fontSize: 16 }}>
                    {"No recent connections"}
                  </Typography>
                </CardContent>
              </Card>
            </div>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default RecentConnections;
