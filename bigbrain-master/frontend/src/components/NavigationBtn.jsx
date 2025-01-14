import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Box } from '@mui/material';
import { styled } from '@mui/system';

export const InitialTap = styled(Tab)({
  width: '17%',
  height: '65px'
})

// the button on the top of page before logining in
export const NavigationBtn = () => {
  const navigate = useNavigate();
  const [value, setValue] = React.useState('two');
  const path = useLocation();
  // set the value
  React.useEffect(() => {
    if (path.pathname === '/') {
      setValue('one');
    } else if (path.pathname === '/login') {
      setValue('two');
    } else if (path.pathname === '/register') {
      setValue('three');
    }
  }, []);

  return (
      <>
      {/* a11y */}
        <Box sx={{ width: '100%', borderBottom: '2px black solid', paddingBottom: '10px' }}>
          <Tabs
            value={value}
            textColor="secondary"
            indicatorColor="secondary"
            aria-label="Navigation button"
            role="button"
          >
            {/* a11y, buttons that control the page */}
            <InitialTap id="homepage" role="homepage" value="one" label="Home" onClick={() => navigate('/')}/>
            <InitialTap id="loginpage" role="loginpage" value="two" label="Login" onClick={() => navigate('/login')}/>
            <InitialTap id="registerpage" role="registerpage" value="three" label="Register" onClick={() => navigate('/register')} />
          </Tabs>
        </Box>
      </>
  );
}

export default NavigationBtn;
