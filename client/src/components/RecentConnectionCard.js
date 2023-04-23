import React, { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Modal,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import style from "./RecentConnectionCard.module.css";
import { login } from "../helpers/userHelpers";
import { useNavigate } from "react-router-dom";

const RecentConnectionCard = ({ user, setRecentUsers }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [checkingInfo, setCheckingInfo] = useState(false);

  const navigate = useNavigate();

  const handleSumbitLogin = async () => {
    if (!password) {
      setError("Password requried");
      return;
    }

    setCheckingInfo(true);

    try {
      await login(user.email, password);
      navigate("/");
    } catch (e) {
      if (e.response.status === 401) setError("Wrong password");
      else setError("An error has accured");
    } finally {
      setCheckingInfo(false);
    }
  };

  const handleRemoveConnection = () => {
    const recentConnections = JSON.parse(
      localStorage.getItem("recentConnections")
    );

    const indexOfUser = recentConnections.findIndex(
      (connection) => connection.email === user.email
    );

    recentConnections.splice(indexOfUser, 1);

    localStorage.setItem(
      "recentConnections",
      JSON.stringify(recentConnections)
    );

    setRecentUsers(recentConnections);
  };

  const closeLoginModal = () => {
    setPassword("");
    setError("");
    setIsOpen(false);
  };
  return (
    <>
      <div className={style.containsCard}>
        <Tooltip title="Remove connection">
          <IconButton
            onClick={() => {
              handleRemoveConnection();
            }}
            style={{
              marginBottom: -40,
              marginLeft: -120,
              zIndex: 1,
              border: "none",
            }}
          >
            <CloseOutlinedIcon
              style={{
                color: "white",
                fontSize: 20,
                background: "gray",
                borderRadius: "50%",
              }}
            />
          </IconButton>
        </Tooltip>
        <Card className={style.card} sx={{ width: 150 }}>
          <CardMedia
            component="img"
            height="150"
            image={`${user.profilePic}`}
            alt="user profile pic"
            sx={{ cursor: "pointer" }}
            onClick={() => setIsOpen(true)}
          ></CardMedia>
          <CardContent
            sx={{
              height: 20,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography sx={{ fontSize: 16 }}>
              {`${user.firstName} ${user.lastName}`}
            </Typography>
          </CardContent>
        </Card>
      </div>
      <Modal open={isOpen} onClose={closeLoginModal}>
        <Card className={style.modalCard}>
          <CardMedia
            component={"div"}
            className={style.cardImg}
            sx={{ backgroundImage: `url(${user.profilePic})` }}
            alt="user profile pic"
            onClick={() => setIsOpen(true)}
          ></CardMedia>
          <Typography sx={{ fontSize: 16, textAlign: "center" }}>
            {`${user.firstName} ${user.lastName}`}
          </Typography>
          <TextField
            label="Password"
            autoFocus
            value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSumbitLogin();
              }
            }}
          />

          {error && <div className={style.error}>{error}</div>}
          <Button
            variant="contained"
            style={{ background: "rgb(209, 46, 100)" }}
            onClick={handleSumbitLogin}
            disabled={checkingInfo}
          >
            Log In
          </Button>
        </Card>
      </Modal>
    </>
  );
};

export default RecentConnectionCard;
