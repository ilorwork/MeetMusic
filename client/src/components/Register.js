import { Button, FormControl, FormControlLabel, FormLabel, Paper, Radio, RadioGroup, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import style from './Register.module.css';
import '../services/requestsToServer';
import { apiGet } from '../services/requestsToServer';

const Register = () => {
  const [arrOfCountries, setArrOfCountries] = useState([]);
  useEffect(() => {
    getCountries();
  }, [])
  const getCountries = async () => {
    // "https://ajayakv-rest-countries-v1.p.rapidapi.com/rest/v1/all"
    const { data } = await apiGet("http://fs1.co.il/bus/shop.php");
    setArrOfCountries(data);
    console.log(data);
  }
  return (
    <div className={style.connection}>
      <Paper elevation={3} sx={{ width: 400, height: 400, padding: "0 8px" }}>
        <div className={style.inputs}>
          <div className={style.names}>
            <TextField label="First name" variant="outlined" autoFocus sx={{ marginRight: 2 }} />
            <TextField label="Last name" variant="outlined" />
          </div>
          <TextField label="Email or phone number" variant="outlined" />
          <TextField label="New password" variant="outlined" />
          <div className={style.dateOfBirthAndGender}>

            <FormControl>
              <FormLabel>Gender</FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
              >
                <FormControlLabel value="female" control={<Radio />} label="Female" />
                <FormControlLabel value="male" control={<Radio />} label="Male" />
              </RadioGroup>
            </FormControl>

            <TextField
              id="date"
              label="Birthday"
              type="date"
              defaultValue="2000-01-01"
            />
          </div>
          <Button variant="contained">Create a new account</Button>
          <div className={style.createAccount}>
            <Button variant="contained" color="success" sx={{ width: 300 }}>Connect</Button>
          </div>
        </div>
      </Paper>
    </div>
  )
}

export default Register;