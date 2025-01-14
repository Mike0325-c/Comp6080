import React from 'react';
import { apiCall, checkEmail, checkPassword, checkName } from './HelpFunctions';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { styled } from '@mui/system';

const Registerdiv = styled('div')({
  padding: '10px'
})

// signup page
function SignUp () {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const nav = () => {
    navigate('/login');
  }
  // register function
  async function register () {
    if (checkEmail(email) && checkPassword(password) && checkName(name)) {
      const res = apiCall('/admin/auth/register', 'POST', { email, password, name });
      res.then((data) => {
        if (data.error) {
          alert(data.error);
        } else {
          setOpen(true);
        }
      })
    }
  }

  function keyRegister (e) {
    if (e.key === 'Enter') {
      register();
    }
  }

  return (
        <>
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { m: 1, minWidth: '360px' },
            }}
            noValidate
            autoComplete="off"
          >
            <div>
              <Registerdiv><label htmlFor='outlined-multiline-flexible' id='Enter your email'>Email:</label></Registerdiv>
              <TextField
                id="outlined-multiline-flexible"
                class="registerEmail"
                aria-describedby='Enter your email'
                label="Please enter your email"
                multiline
                role='input email'
                maxRows={4}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div>
              <Registerdiv><label htmlFor='filled-multiline-flexible' id='Enter your password'>Password:</label></Registerdiv>
              <TextField
                id="filled-multiline-flexible"
                class="registerPassword"
                aria-describedby='Enter your password'
                label="Please enter your password"
                multiline
                role='input password'
                maxRows={4}
                variant="filled"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
            <div>
            <Registerdiv><label htmlFor='filled-multiline-flexible' id='Enter your Name'>Name:</label></Registerdiv>
              <TextField
                id="filled-multiline-flexible"
                class="registerName"
                aria-describedby='Enter your Name'
                label="Please enter your name"
                multiline
                role='input Name'
                maxRows={4}
                variant="filled"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>
          </Box>
          <Button id='registerbutton' role="register" variant="contained" color="success" onKeyDown={keyRegister} onClick={register} sx={{ marginTop: '30px' }}>register</Button>
          <div>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  You have successfully register!
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button id="gotoLogin" onClick={nav} autoFocus>
                  Go to login!
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </>
  );
}
export default SignUp;
