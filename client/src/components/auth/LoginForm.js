import { Button, Paper, TextField } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../helpers/userHelpers";
import style from "./LoginForm.module.css";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [checkingInfo, setCheckingInfo] = useState(false);

  const navigate = useNavigate();

  const handleSumbitLogin = async () => {
    if (!email || !password) {
      setError("Email and Password requried");
      return;
    }

    setCheckingInfo(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (e) {
      if (e.response.status === 401) setError("Wrong email or password");
      else if (e.response.status === 404) setError("User not found");
      else setError("An error has accured");
    } finally {
      setCheckingInfo(false);
    }
  };

  const onFieldChange = (e, setStateFunc) => {
    setStateFunc(e.target.value);
    setError("");
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
          type="email"
          onChange={(e) => onFieldChange(e, setEmail)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSumbitLogin();
            }
          }}
        />
        <TextField
          label="Password"
          value={password}
          type="password"
          onChange={(e) => onFieldChange(e, setPassword)}
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
        <div className={style.createAccountBtnWrapper}>
          <Button
            className={style.createAccountBtn}
            variant="contained"
            style={{ background: "rgb(19 137 137)" }}
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
