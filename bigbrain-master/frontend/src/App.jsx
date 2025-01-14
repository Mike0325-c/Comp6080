import React from 'react';
import { styled } from '@mui/system';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import InitialDash from './root/InitialDash';
import LoginPage from './root/LoginPage';
import RegisterPage from './root/RegisterPage';
import Dashboard from './root/Dashboard';
import EditFunction from './root/EditGame';
import EditQuestion from './root/EditQuestion';
import NewGame from './root/NewGame';
import Result from './root/Result';
import SuccessMsg from './root/SuccessMessage';
import PlayGame from './root/PlayGame';
import History from './root/History';
import ModifyQuestion from './root/ModifyQuestion';
export const TotalContainer = styled('div')({
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  margin: '5px 25px'
})
function App () {
  return (
      <TotalContainer>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<InitialDash />} />
            <Route path="/login" element ={<LoginPage />}></Route>
            <Route path="/register" element ={<RegisterPage />}></Route>
            <Route path="/dashboard" element ={<Dashboard />}></Route>
            <Route path="/dashboard/newgame" element ={<NewGame />}></Route>
            <Route path="/dashboard/newgame/:name" element ={<SuccessMsg />}></Route>
            <Route path="/dashboard/newquestion/:name" element ={<SuccessMsg />}></Route>
            <Route path="/editgame/:gameid" element ={<EditFunction />}></Route>
            <Route path="/editquestion/:gameid/:questionid" element ={<EditQuestion />}></Route>
            <Route path="/modifyquestion/:gameid/:questionid" element ={<ModifyQuestion />}></Route>
            <Route path="/result/:sessionid" element ={<Result />}></Route>
            <Route path="/playgame/:sessionid" element ={<PlayGame />}></Route>
            <Route path="/history/:gameid" element ={<History />}></Route>
          </Routes>
        </BrowserRouter>
      </TotalContainer>
  );
}

export default App;
