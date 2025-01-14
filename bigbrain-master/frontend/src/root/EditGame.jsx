import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { apiCall, fileToDataUrl } from '../components/HelpFunctions';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import DashboardBtn from '../components/DashboardBtn';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

// edit game page
const EditFunction = () => {
  const param = useParams();
  const navigate = useNavigate();
  const [questionInfo, setQuestionInfo] = React.useState([]);
  const questionId = Date.now();
  const [thumbnail, setThumbnail] = React.useState('');
  const [name, setName] = React.useState('');
  const [originalName, setOriginalName] = React.useState('');

  const gameThumbnail = (event) => {
    const file = event.target.files[0];
    fileToDataUrl(file).then((data) => {
      setThumbnail(data);
    });
  };

  // function to update a game
  function updateGame () {
    const res = apiCall(`/admin/quiz/${param.gameid}`, 'PUT',
      {
        questions: questionInfo,
        name,
        thumbnail
      });
    res.then((data) => {
      if (data.error) {
        alert(data.error);
      }
    })
    console.log('jjy');
    navigate('/dashboard');
  }

  useEffect(() => {
    apiCall(`/admin/quiz/${param.gameid}`, 'GET', {}).then((res) => {
      if (res.error) {
        alert(res.error);
      } else {
        setOriginalName(res.name);
        setQuestionInfo(res.questions);
      }
    });
  }, [])
  // function to delete a particular question
  const deleteQuestion = (questionIndex) => {
    return async () => {
      let deleteList = [];
      deleteList = questionInfo;
      console.log(deleteList, questionIndex);
      deleteList.splice(questionIndex, 1);
      console.log(deleteList, questionIndex);
      apiCall(`/admin/quiz/${param.gameid}`, 'PUT', {
        questions: deleteList,
        name,
        thumbnail
      }).then((res) => {
        if (res.error) {
          alert(res.error);
        }
      });
      navigate(`/editgame/${param.gameid}`);
    }
  }
  return (
    <>
      <DashboardBtn></DashboardBtn>
      <Button id='return' role='return' variant="outlined" color="error" sx={{ position: 'relative', right: '43%', top: '3%' }} onClick={() => { navigate('/dashboard') } }>
          Return
      </Button>
      <h2 style={{ position: 'relative', bottom: '5%' }}>Edit your game!</h2>
      <div style={{ width: '95%', height: '57%', border: '2px silver solid', padding: '1%' }}>
        <div style={{ display: 'flex', width: '90%' }}>
          <Box sx={{ width: '60%', margin: '1%', padding: '0px' }} component="form" noValidate autoComplete="off">
            <h3 style={{ width: '60%' }}>game id: {param.gameid}</h3>
            <div>
              <div style={{ marginLeft: '20%', marginTop: '2%' }} ><label htmlFor='outlined-multiline-flexible-name' id='Enter your email'>name:</label></div>
              <FormControl sx={{ width: '50%', marginTop: '2%' }}>
                <OutlinedInput id="outlined-multiline-flexible-name" aria-describedby='Enter your email' placeholder={originalName} onChange={(e) => {
                  setName(e.target.value);
                }}/>
              </FormControl>
            </div>
            <div>
              <div style={{ marginLeft: '13%', marginTop: '2%' }} ><label htmlFor='outlined-multiline-flexible' id='Enter your thumbnail'>thumbnail:</label></div>
              <FormControl sx={{ width: '25%', marginTop: '2%' }}>
                <input
                type="file"
                accept="image/jpeg, image/jpg"
                aria-describedby='Enter your thumbnail'
                onChange={gameThumbnail}
                style={{ marginLeft: '7%', marginTop: '2%' }}
                />
              </FormControl>
            </div>
            <input aria-label='thumbnail' style={{ fontSize: '20px', width: '47%', height: '14%', margin: '2% 2%' }} type="text" value={thumbnail} />
          </Box>
          <div style={{ width: '55%', height: '100%' } }>
            <Button id='addquestion' role='addquestion' sx={{ position: 'relative', right: '12%' }} variant="outlined" color="secondary" disableElevation onClick={() => { navigate(`/editquestion/${param.gameid}/${questionId}`) }}>
              add a new question
            </Button>
              <Box sx={{ width: '110%', marginTop: '10px', background: 'rgb(240, 239, 239)', overflow: 'auto', height: '250px', position: 'relative', right: '45%', padding: '20px' }}>
                <Stack spacing={2}>
                  {Array.isArray(questionInfo) && (questionInfo.length > 0) && questionInfo.map((item, index) => (
                    <Item key = {Math.random()} sx={{ height: '96px', textAlign: 'left' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <img style={{ width: '50px', height: '50px', borderRadius: '6%', border: '1px silver solid', overflow: 'hidden' }} src={item.img} alt='the img of question'></img>
                        <b title={item.name} style={ { width: '10%', overflow: 'hidden', textOverflow: 'ellipsis' } }>{item.name}</b>
                        <div>
                          <Button size='small' variant="contained" color="success" onClick={() => { navigate(`/modifyquestion/${param.gameid}/${questionInfo[index].id}`) }}>edit</Button><br /><br />
                          <Button size='small' variant="outlined" color="error" onClick={deleteQuestion(index)} >delete</Button>
                        </div>
                      </div>
                    </Item>
                  ))}
                 </Stack>
              </Box>
          </div>
        </div>
      </div>

    <Button id='confirmGame' sx={{ marginTop: '20px' }} variant="contained" disableElevation onClick={updateGame}>
          confirm
    </Button>
    </>

  );
}

export default EditFunction;
