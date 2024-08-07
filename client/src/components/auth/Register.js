import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import style from "../users/UserInfo.module.css";
import { v4 as uuid } from "uuid";
import { login, notifyUser, register } from "../../helpers/userHelpers";
import RecentConnections from "./RecentConnections";
import loginStyle from "./Login.module.css";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [reEnteredPassword, setReEnteredPassword] = useState("");
  const [gender, setGender] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [countriesAndCities, setCountriesAndCities] = useState([]);
  const [citiesOfSelectedCountry, setCitiesOfSelectedCountry] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    getAllCountriesAndCities();
  }, []);

  useEffect(() => {
    const indexOfCountry = countriesAndCities.findIndex(
      (c) => country === c.name
    );
    if (indexOfCountry !== -1)
      setCitiesOfSelectedCountry(countriesAndCities[indexOfCountry].cities);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country]);

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 225,
        width: 166,
      },
    },
  };

  const onFieldChange = (e, setStateFunc) => {
    setStateFunc(e.target.value);
    setError("");
  };

  const handleCountryChange = (e) => {
    setCountry(e.target.value);
    setCity("");
    setError("");
  };

  const getAllCountriesAndCities = async () => {
    const { data } = await axios.get(
      "https://countriesnow.space/api/v0.1/countries"
    );

    setCountriesAndCities(
      data.data.map((item) => {
        return { name: item.country, cities: item.cities };
      })
    );
  };

  const hanbleSubmitForm = async () => {
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !reEnteredPassword ||
      !gender ||
      !birthDate
    ) {
      setError("One or more mendatory fields are empty");
      return;
    }

    if (password !== reEnteredPassword) {
      setError("Passwords aren't equal");
      return;
    }

    const newUser = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      gender: gender,
      birthDate: birthDate,
      country: country,
      city: city,
    };

    try {
      const createdUser = await register(newUser);
      await login(email, password);
      await notifyUser(createdUser._id, "Welcome to MeetMusic");

      navigate("/");
    } catch (e) {
      if (e.response.data.includes("duplicate key"))
        setError("Account with same Email already exist");
      else if (e.response.data.includes("Invalid email"))
        setError("Invalid email address");
      else if (e.response.data.includes("strong"))
        setError(
          "Password must be at least 8 characters, and contain at least one uppercase and one lowercase letter"
        );
      else setError("An error has accured");
    }
  };

  return (
    <div className={loginStyle.container}>
      <RecentConnections />
      <div className={style.registerFormContainer}>
        <Paper
          className={style.userInfoFormPaper}
          elevation={3}
          sx={{ height: 630 }}
        >
          <div className={style.flexRowCenterGroup}>
            <TextField
              required
              label="First name"
              autoFocus
              sx={{ marginRight: 3 }}
              value={firstName}
              onChange={(e) => onFieldChange(e, setFirstName)}
            />
            <TextField
              required
              label="Last name"
              value={lastName}
              onChange={(e) => onFieldChange(e, setLastName)}
            />
          </div>
          <TextField
            required
            label="Email"
            value={email}
            type="email"
            onChange={(e) => onFieldChange(e, setEmail)}
          />
          <TextField
            required
            label="Password"
            value={password}
            type="password"
            onChange={(e) => onFieldChange(e, setPassword)}
          />
          <TextField
            required
            // error={error ? true : false}
            label="Re-enter Your Password"
            value={reEnteredPassword}
            type="password"
            onChange={(e) => onFieldChange(e, setReEnteredPassword)}
          />
          <div className={style.flexRowCenterGroup}>
            <FormControl sx={{ marginRight: 2 }}>
              <FormLabel required>Gender</FormLabel>
              <RadioGroup
                required
                row
                onChange={(e) => onFieldChange(e, setGender)}
                value={gender}
              >
                <FormControlLabel
                  value="male"
                  control={<Radio />}
                  label="Male"
                />
                <FormControlLabel
                  value="female"
                  control={<Radio />}
                  label="Female"
                />
              </RadioGroup>
            </FormControl>
            <FormControl>
              <FormLabel required>Birth Date</FormLabel>
              <TextField
                required
                type="date"
                value={birthDate}
                onChange={(e) => onFieldChange(e, setBirthDate)}
              />
            </FormControl>
          </div>
          <div className={style.flexRowCenterGroup}>
            <FormControl sx={{ m: 1, width: 200, marginRight: 2 }}>
              <InputLabel>Country</InputLabel>
              <Select
                value={country}
                onChange={handleCountryChange}
                label="Country"
                MenuProps={MenuProps}
              >
                {countriesAndCities.map((c) => (
                  <MenuItem key={uuid()} value={c.name}>
                    {c.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ m: 1, width: 200 }}>
              <InputLabel>City</InputLabel>
              <Select
                value={city}
                onChange={(e) => onFieldChange(e, setCity)}
                label="City"
                MenuProps={MenuProps}
              >
                {citiesOfSelectedCountry.map((c) => (
                  <MenuItem key={uuid()} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          {error && <div className={style.error}>{error}</div>}
          <Button
            variant="contained"
            style={{ background: "rgb(209, 46, 100)" }}
            sx={{ my: 3 }}
            onClick={hanbleSubmitForm}
          >
            Create a new account
          </Button>
          <div className={style.loginDiv}>
            <Button
              className={style.loginBtn}
              variant="contained"
              style={{ background: "rgb(19 137 137)" }}
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          </div>
        </Paper>
      </div>
    </div>
  );
};

export default Register;
