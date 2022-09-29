import { Button, Paper, TextField } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import style from "./LoginForm.module.css";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSumbitLogin = async () => {
    if (!email || !password) return;

    const userInfo = { email, password };
    try {
      const res = await axios.post(
        "http://localhost:7000/users/login",
        userInfo,
        {
          // credentials: true,
          // headers: { "Access-Control-Allow-Origin": true },
          // headers: { "Access-Control-Allow-Origin": "*" },
        }
      );
      console.log("res", res.headers.authorization);
      // console.log("res cookies", res.cookies);
      // console.log("res cookie", res.cookies);
      localStorage.setItem("token", res.headers.authorization);
      navigate("/");
    } catch (err) {
      throw new Error("Login user has failed " + err);
    }
  };

  return (
    <div className={style.formContainer}>
      <Paper
        className={style.formPaper}
        sx={{ width: 400, height: 400, px: "8px" }}
      >
        <TextField
          label="Email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" onClick={handleSumbitLogin}>
          Login
        </Button>
        <div className={style.createAccountBtnWrapper}>
          <Button variant="contained" color="success" sx={{ width: 300 }}>
            Create a new account
          </Button>
        </div>
      </Paper>
    </div>
  );
};

export default LoginForm;
