import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Box, Button } from '@mui/material';
import { apiCall } from './HelpFunctions';

// the button on the top of dashboard after logining in
export const DashboardBtn = () => {
  const navigate = useNavigate();
  const [value, setValue] = React.useState('one');
  const path = useLocation();
  React.useEffect(() => {
    if (path.pathname === '/dashboard') {
      setValue('one');
    }
  }, []);

  // logout function
  function logout () {
    apiCall('/admin/auth/logout', 'POST', {}).then(data => console.log(data));
    navigate('/login');
    localStorage.removeItem('token');
  }

  return (
      <>
          <Box sx={{ width: '100%', borderBottom: '2px black solid', paddingBottom: '10px' }}>
          <Tabs
            value={value}
            textColor="secondary"
            indicatorColor="secondary"
            aria-label="dashboard button"
            role = 'show dashboard'
          >
            <Tab sx={{ width: '17%', height: '65px' }} value="one" label="Dashboard" onClick={() => navigate('/dashboard')}/>
            {/* login out button */}
            <Button id="logout" role="logout" variant="contained" sx={{ height: '40px', marginLeft: '30%', marginTop: '17px' }} onClick={logout}>Logout</Button>
          </Tabs>
        </Box>
      </>

  );
}

export default DashboardBtn;
