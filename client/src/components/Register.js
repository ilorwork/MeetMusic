import { Button, FormControl, FormControlLabel, FormLabel, Paper, Radio, RadioGroup, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import style from './Register.module.css';
import '../services/requestsToServer';
import { apiGet } from '../services/requestsToServer';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';

const Register = () => {
  const [arrOfCountries, setArrOfCountries] = useState([]);
  const [arrOfAllCities, setArrOfAllCities] = useState([]);
  const [country, setCountry] = useState([]);
  const [city, setCity] = useState([]);
  let index = 0;
  let [arrOfCitiesOfCountry, setArrOfCitiesOfCountry] = useState([]);
  const theme = useTheme();

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 225,
        width: 166,
      },
    },
  };

  const getStyles = (name, countryOrCity, theme) => {
    // console.log(name, countryOrCity, theme);
    return {
      fontWeight:
        countryOrCity.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

  const handleChangeForCountry = (event) => {
    // console.log(event.target.value);
    const {
      target: { value },
    } = event;
    // console.log(value);
    setCountry(
      [value]
    );
    setCity([]);
  };
  const handleChangeForCity = (event) => {
    // console.log(event.target.value);
    const {
      target: { value },
    } = event;
    // console.log(value);
    setCity(
      [value]
    );
  };

  const getAllCountriesAndCities = async () => {
    const { data } = await apiGet("https://countriesnow.space/api/v0.1/countries");
    setArrOfCountries(data.data.map((item) => item.country));
    setArrOfAllCities(data.data.map((item) => item.cities));
  }

  useEffect(() => {
    getAllCountriesAndCities();
  }, []);

  useEffect(() => {
    index = arrOfCountries.indexOf(country.toString());
    // console.log(index);
    // console.log(country);
    setArrOfCitiesOfCountry(arrOfAllCities[index]);
  }, [country]);

  // console.log(arrOfCities);
  // console.log(arrOfCitiesOfCountry);
  // useEffect(() => {
  //     console.log(country);
  // }, [country]);
  // console.log(arrOfCountries);
  // console.log(arrOfCities);

  return (
    <div className={style.connection}>
      <Paper elevation={3} sx={{ width: 400, height: 550, padding: "0 8px" }}>
        <div className={style.inputs}>
          <div className={style.names}>
            <TextField label="First name" variant="outlined" autoFocus sx={{ marginRight: 3 }} />
            <TextField label="Last name" variant="outlined" />
          </div>
          <TextField label="Email or phone number" variant="outlined" />
          <TextField label="New password" variant="outlined" />
          <div className={style.dateOfBirthAndGender}>
            <div className={style.names}>
              <FormControl sx={{ marginRight: 2 }}>
                <FormLabel>Gender</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  defaultValue="male"
                >
                  <FormControlLabel value="male" control={<Radio />} label="Male" />
                  <FormControlLabel value="female" control={<Radio />} label="Female" />
                </RadioGroup>
              </FormControl>
              <TextField
                id="date"
                label="Birthday"
                type="date"
                defaultValue="2000-01-01"
              />
            </div>
          </div>
          <div className={style.names}>
            <FormControl sx={{ m: 1, width: 200, marginRight: 2 }}>
              <InputLabel>Country</InputLabel>
              <Select
                value={country}
                onChange={handleChangeForCountry}
                input={<OutlinedInput label="Country" sx={{ minHeight: 70 }} />}
                renderValue={(selected) => (
                  city && <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {arrOfCountries.map((name) => (
                  <MenuItem
                    key={name}
                    value={name}
                    style={getStyles(name, country, theme)}
                  >
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ m: 1, width: 200 }}>
              <InputLabel>City</InputLabel>
              <Select
                value={city}
                onChange={handleChangeForCity}
                input={<OutlinedInput label="City" sx={{ minHeight: 70 }} />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {arrOfCitiesOfCountry?.map((name) => (
                  <MenuItem
                    key={name}
                    value={name}
                    style={getStyles(name, city, theme)}
                  >
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div >

          <Button variant="contained" sx={{ mt: 3 }}>Create a new account</Button>
          <div className={style.connect}>
            <Button variant="contained" color="success" sx={{ width: 300 }}>Connect</Button>
          </div>

        </div>
      </Paper>
    </div>
  )
}

export default Register;