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
import axios from "axios";
import style from "./UserInfo.module.css";
import { v4 as uuid } from "uuid";
import { editUser } from "../helpers/userHelpers";

const EditUser = ({ user, setUser, setIsOpen }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [gender, setGender] = useState(user.gender);
  const [birthDate, setBirthDate] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [countriesAndCities, setCountriesAndCities] = useState([]);
  const [citiesOfSelectedCountry, setCitiesOfSelectedCountry] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getAllCountriesAndCities();
    setBirthDate(user.birthDate.split("T")[0]);
  }, []);

  useEffect(() => {
    const indexOfCountry = countriesAndCities.findIndex(
      (c) => country === c.name
    );
    if (indexOfCountry !== -1)
      setCitiesOfSelectedCountry(countriesAndCities[indexOfCountry].cities);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country]);

  useEffect(() => {
    if (countriesAndCities.length) setCountry(user.country);
  }, [countriesAndCities]);

  useEffect(() => {
    if (citiesOfSelectedCountry.length) setCity(user.city);
  }, [citiesOfSelectedCountry]);

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
    if (!firstName || !lastName || !gender || !birthDate) {
      setError("One or more mendatory fields are empty");
      return;
    }

    const fieldsToUpdate = {
      firstName: firstName,
      lastName: lastName,
      gender: gender,
      birthDate: birthDate,
      country: country,
      city: city,
    };

    try {
      const updatedUser = await editUser(fieldsToUpdate);
      setUser(updatedUser);
      setIsOpen(false);
    } catch (e) {
      setError("An error has accured");
    }
  };

  return (
    <div className={style.editFormContainer}>
      <Paper
        className={style.userInfoFormPaper}
        elevation={3}
        sx={{ width: 400, height: 480 }}
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

        <div className={style.flexRowCenterGroup}>
          <FormControl sx={{ marginRight: 2 }}>
            <FormLabel required>Gender</FormLabel>
            <RadioGroup
              required
              row
              onChange={(e) => onFieldChange(e, setGender)}
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
          Update
        </Button>
      </Paper>
    </div>
  );
};

export default EditUser;
