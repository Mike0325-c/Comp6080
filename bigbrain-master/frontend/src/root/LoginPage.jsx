import React from 'react';
import SignIn from '../components/SignIn';
import NavigationBtn from '../components/NavigationBtn';
// the login page
const LoginPage = () => {
  return (
        <>
            <NavigationBtn></NavigationBtn>
            <h1>Login in</h1>
            <SignIn></SignIn>
        </>
  );
}

export default LoginPage;
