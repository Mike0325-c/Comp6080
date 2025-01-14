import React from 'react';
import { apiCall } from '../components/HelpFunctions';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { DashboardBtn } from '../components/DashboardBtn';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import Box from '@mui/material/Box';
import { styled } from '@mui/system';

// page to create a new game
const NewgameDiv = styled('div')({
  width: '80%',
  marginTop: '200px',
  marginLeft: '25%',
  position: 'relative',
  bottom: '70px'
})

// post a new game to backend can rerender the page
function NewGame () {
  const navigate = useNavigate();
  const [newQuizName, setNewQuizName] = React.useState('');
  function createNewGame () {
    if (newQuizName.length === 0) {
      alert('Game name can not be null');
      return;
    }
    apiCall('/admin/quiz/new', 'POST', { name: newQuizName });
    navigate(`/dashboard/newgame/${newQuizName}`);
  }

  return (
    <>
      <DashboardBtn></DashboardBtn>
      <Button id='return' role='return' variant="outlined" color="error" sx={{ position: 'relative', right: '43%', top: '3%' }} onClick={() => { navigate('/dashboard') }}>
        Return
      </Button>
      <NewgameDiv>
        <h2 id='Game Name'>Game Name:</h2>
        <Box component="form" noValidate autoComplete="off">
          <FormControl sx={{ width: '80%' }}>
            <OutlinedInput id='enterGame' sx={{ width: '90%' }} placeholder="Please enter text" value={newQuizName} onChange={(e) => setNewQuizName(e.target.value)}
              aria-describedby='Game Name' />
          </FormControl>
        </Box>
      </NewgameDiv>
      <Button id="newgame" role='newgame' variant='contained' onClick={createNewGame}>create new game</Button>
    </>
  );
}

export default NewGame;
