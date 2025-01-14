import React from 'react';
import NavigationBtn from '../components/NavigationBtn';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
// the inital page
const InitialDash = () => {
  return (
        <>
            <NavigationBtn/>
            <React.Fragment>
                <CssBaseline />
                <Container maxWidth="sm">
                <Box sx={{ bgcolor: 'rgb(231, 235, 238)', height: '89vh', textAlign: 'center', fontSize: '40px', margin: '0px' }}><span>welcome!</span></Box>
                </Container>
            </React.Fragment>
        </>
  );
}

export default InitialDash;
