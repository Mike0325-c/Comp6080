import React from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { apiCall } from './HelpFunctions';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';

const Logindiv = styled('div')({
  padding: '10px'
})

// signin page
function SignIn () {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const navigate = useNavigate();
  // login function
  async function login () {
    const res = apiCall('/admin/auth/login', 'POST', { email, password });
    res.then((data) => {
      if (data.error) {
        alert(data.error)
      } else {
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
      }
    })
  }

  function keyLogin (e) {
    if (e.key === 'Enter') {
      login();
    }
  }

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
                class="loginEmail"
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
                class="loginPassword"
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
          <Button id='loginbutton' role='login' variant="contained" color="success" onKeyDown={keyLogin} onClick={login} sx={{ marginTop: '30px' }}>login</Button>
        </>
  )
}

export default SignIn;
