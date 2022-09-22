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
import { apiGet } from "../services/requestsToServer";
import style from "./Register.module.css";
import { v4 as uuid } from "uuid";

const Register = () => {
  const [countries, setCountries] = useState([]);
  const [citiesOfSelectedCountry, setCitiesOfSelectedCountry] = useState([]);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");

  useEffect(() => {
    getAllCountriesAndCities();
  }, []);

  useEffect(() => {
    const indexOfCountry = countries.findIndex((c) => country === c.name);
    if (indexOfCountry !== -1)
      setCitiesOfSelectedCountry(countries[indexOfCountry].cities);
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
    const { data } = await apiGet(
      "https://countriesnow.space/api/v0.1/countries"
    );

    setCountries(
      data.data.map((item) => {
        return { name: item.country, cities: item.cities };
      })
    );
  };

  return (
    <div className={style.registrationFormContainer}>
      <Paper
        className={style.registrationFormPaper}
        elevation={3}
        sx={{ width: 400, height: 550 }}
      >
        <div className={style.flexRowCenterGroup}>
          <TextField label="First name" autoFocus sx={{ marginRight: 3 }} />
          <TextField label="Last name" />
        </div>
        <TextField label="Email" />
        <TextField label="Password" />
        <div className={style.flexRowCenterGroup}>
          <FormControl sx={{ marginRight: 2 }}>
            <FormLabel>Gender</FormLabel>
            <RadioGroup row>
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
            <TextField type="date" />
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
              {countries.map((c) => (
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

        <Button variant="contained" sx={{ my: 3 }}>
          Create a new account
        </Button>
        <div className={style.loginBtn}>
          <Button variant="contained" color="success" sx={{ width: 300 }}>
            Login
          </Button>
        </div>
      </Paper>
    </div>
  );
};

export default Register;
