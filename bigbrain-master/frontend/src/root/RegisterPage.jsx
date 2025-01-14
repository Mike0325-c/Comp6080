import React from 'react';
import SignUp from '../components/SignUp';
import NavigationBtn from '../components/NavigationBtn';

const RegisterPage = () => {
  return (
        <>
            <NavigationBtn></NavigationBtn>
            <h1>Sign up your account!</h1>
            <SignUp></SignUp>
        </>
  );
}

export default RegisterPage;
