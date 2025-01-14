import React from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { styled } from '@mui/system';

// test component
const Logindiv = styled('div')({
  padding: '10px'
})

function SignInTest (props) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  console.log(password);
  console.log(email);

  return (
        <>
          <Box
            id='loginbox'
            component="form"
            sx={{
              '& .MuiTextField-root': { m: 1, minWidth: '360px' },
            }}
            noValidate
            autoComplete="off"
          >
            <div>
              <Logindiv><label htmlFor='outlined-multiline-flexible' id='Enter your email'>Email:</label></Logindiv>
              <TextField
                id="outlined-multiline-flexible"
                aria-describedby='Enter your email'
                label="Please enter your email"
                multiline
                maxRows={4}
                role='input email'
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div>
              <Logindiv><label htmlFor='filled-multiline-flexible' id='Enter your password'>password:</label></Logindiv>
              <TextField
                id="filled-multiline-flexible"
                aria-describedby='Enter your password'
                label="Please enter your password"
                multiline
                maxRows={4}
                role='input password'
                variant="filled"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
          </Box>
          <Button id='loginbutton' role='login' variant="contained" color="success" onClick={props.login} sx={{ marginTop: '30px' }}>login</Button>
        </>
  )
}

export default SignInTest;
