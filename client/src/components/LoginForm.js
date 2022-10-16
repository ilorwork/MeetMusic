import { Button, Paper, TextField } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../helpers/userHelpers";
import style from "./LoginForm.module.css";

const LoginForm = () => {
  const [email, setEmail] = useState("a@b.c");
  const [password, setPassword] = useState("1234");

  const navigate = useNavigate();

  const handleSumbitLogin = async () => {
    if (!email || !password) return;

    try {
      await login(email, password);
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
          <Button
            variant="contained"
            color="success"
            sx={{ width: 300 }}
            onClick={() => navigate("/register")}
          >
            Create a new account
          </Button>
        </div>
      </Paper>
    </div>
  );
};

export default LoginForm;
