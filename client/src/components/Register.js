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
import style from "./Register.module.css";
import { v4 as uuid } from "uuid";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [countriesAndCities, setCountriesAndCities] = useState([]);
  const [citiesOfSelectedCountry, setCitiesOfSelectedCountry] = useState([]);

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

  const handleCountryChange = (e) => {
    setCountry(e.target.value);
    setCity("");
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
    if (!firstName || !lastName || !email || !password || !gender || !birthDate)
      return;

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
      await axios.post("http://localhost:7000/users", newUser);

      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setGender("");
      setBirthDate("");
      setCountry("");
      setCity("");

      navigate("/login");
    } catch (e) {
      console.error("Failed to login " + e);
      // TODO: Present some error to the user
    }
  };

  return (
    <div className={style.registrationFormContainer}>
      <Paper
        className={style.registrationFormPaper}
        elevation={3}
        sx={{ width: 400, height: 550 }}
      >
        <div className={style.flexRowCenterGroup}>
          <TextField
            label="First name"
            autoFocus
            sx={{ marginRight: 3 }}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <TextField
            label="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className={style.flexRowCenterGroup}>
          <FormControl sx={{ marginRight: 2 }}>
            <FormLabel>Gender</FormLabel>
            <RadioGroup
              row
              onChange={(e) => setGender(e.target.value)}
              value={gender}
            >
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel
                value="female"
                control={<Radio />}
                label="Female"
              />
            </RadioGroup>
          </FormControl>
          <FormControl>
            <FormLabel>Birth Date</FormLabel>
            <TextField
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
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
              onChange={(e) => setCity(e.target.value)}
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

        <Button variant="contained" sx={{ my: 3 }} onClick={hanbleSubmitForm}>
          Create a new account
        </Button>
        <div className={style.loginBtn}>
          <Button
            variant="contained"
            color="success"
            sx={{ width: 300 }}
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        </div>
      </Paper>
    </div>
  );
};

export default Register;
