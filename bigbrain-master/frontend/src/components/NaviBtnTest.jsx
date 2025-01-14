import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Box } from '@mui/material';
import { styled } from '@mui/system';

// test component
export const InitialTap = styled(Tab)({
  width: '17%',
  height: '65px'
})

export const NaviBtnTest = () => {
  const [value, setValue] = React.useState('two');
  React.useEffect(() => {
    setValue('one');
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
            {/* a11y */}
            <InitialTap id="homepage" role="homepage" value="one" label="Home" href="/"/>
            <InitialTap id="loginpage" role="loginpage" value="two" label="Login" href="/login"/>
            <InitialTap id="registerpage" role="registerpage" value="three" label="Register" href="/register"/>
          </Tabs>
        </Box>
      </>
  );
}

export default NaviBtnTest;
