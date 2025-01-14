import React, { useEffect } from 'react';
import Button from '@mui/material/Button';
import { DashboardBtn } from '../components/DashboardBtn';
import { styled } from '@mui/material/styles';
import { apiCall, sortGame } from '../components/HelpFunctions';
import Stack from '@mui/material/Stack';
import { Box } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DeleteIcon from '@mui/icons-material/Delete';

const GameStack = styled(Stack)({
  overflow: 'auto',
  width: '90%',
  height: '70%',
  border: '2px solid blue'
})
// dashboard page after the users login in
function Dashboard () {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = React.useState([]);
  const [openStart, setOpenStart] = React.useState(false);
  const [openClose, setOpenClose] = React.useState(false);
  const [quizId, setQuizId] = React.useState();
  const [sessionid, setSessionId] = React.useState();
  const handleCloseEnd = () => {
    setOpenClose(false);
  };

  React.useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    }
  }, []);

  // fetch the quiz and refresh the quiz element on the page
  async function fetchAllQuizzes () {
    const res = apiCall('/admin/quiz', 'GET');
    res.then((data) => {
      if (data.error) {
        alert(data.error)
      } else {
        setQuizzes(sortGame(data.quizzes));
      }
    })
  }

  React.useEffect(async () => {
    await fetchAllQuizzes();
  }, []);

  // delete a quiz
  function Delete (data) {
    return async () => {
      apiCall(`/admin/quiz/${data}`, 'DELETE', {}).then((res) => {
        if (res.error) {
          alert(res.error);
        }
      });
      await fetchAllQuizzes();
    }
  }

  // render a particular quiz
  function QuizMap (data) {
    const [detail, setDetail] = React.useState(null);
    const [gameimg, setGameimg] = React.useState('1');
    const [totalTime, setTotalTime] = React.useState(0);
    // get the information about a particular quiz
    useEffect(() => {
      apiCall(`/admin/quiz/${data.id}`, 'GET', {}).then((res) => {
        if (res.error) {
          alert(res.error);
        } else {
          setDetail(res);
          setGameimg(res.thumbnail)
          let duration = 0;
          for (const time of res.questions) {
            duration += parseInt(time.time);
          }
          setTotalTime(duration);
        }
      });
    }, [])

    const [start, setStart] = React.useState('3');
    // check if a game is starting
    useEffect(() => {
      apiCall(`/admin/quiz/${data.id}`, 'GET', {}).then((res) => {
        if (res.error) {
          alert(res.error);
        } else {
          if (res.active) {
            setStart('1');
          } else {
            setStart('2');
          }
        }
      })
    }, []);

    // the operation after starting a game
    const handleClose = () => {
      apiCall(`/admin/quiz/${data.id}`, 'GET', {}).then((res) => {
        if (res.error) {
          alert(res.error);
        } else {
          const text = `http://localhost:3000/playgame/${localStorage.getItem('sessionId')}`;
          navigator.clipboard.writeText(text);
        }
      })
      setOpenStart(false);
    };
    // the operation after stopping a game
    const handleCloseEndrul = () => {
      setOpenClose(false);
      apiCall(`/admin/quiz/${quizId}`, 'GET', {}).then((res) => {
        if (res.error) {
          alert(res.error);
        } else {
          navigate(`/result/${sessionid}`);
        }
      })
    };
    // game starts
    function startGame (data) {
      return async () => {
        apiCall(`/admin/quiz/${data}/start`, 'POST', {}).then((res) => {
          setTimeout(() => {
            setOpenStart(true);
          }, 100);
          setStart('1');
          if (res.error) {
            alert(res.error);
          } else {
            apiCall(`/admin/quiz/${data}`, 'GET', {}).then((res) => {
              if (res.error) {
                alert(res.error);
              } else {
                localStorage.setItem('sessionId', res.active);
                localStorage.setItem('gameName', res.name);
              }
            })
          }
        });
      }
    }
    // stop a game
    function stopGame (data) {
      setQuizId(data)
      return async () => {
        setStart('2');
        setOpenClose(true)
        apiCall(`/admin/quiz/${data}`, 'GET', {}).then((res) => {
          if (res.error) {
            alert(res.error);
          } else {
            setSessionId(res.active)
          }
        })
        apiCall(`/admin/quiz/${data}/end`, 'POST', {}).then((res) => {
          if (res.error) {
            alert(res.error);
          } else {
            apiCall(`/admin/quiz/${data}`, 'GET', {}).then((res) => {
              if (res.error) {
                alert(res.error);
              }
            })
          }
        });
      }
    }

    function advance (quizId) {
      apiCall('/admin/quiz/' + quizId + '/advance', 'POST')
    }
    return (
        <Box sx={{ height: '95px' }} key={data.id}>
             <Card sx={{ width: '280px', position: 'relative', top: '30px', marginLeft: '20px' }}>
                <CardMedia
                  sx={{ height: 230 }}
                  image= {gameimg || 'https://play-lh.googleusercontent.com/AyJnaQ0JfEu-F_4bop5hH4qpJwYJ1blePyer6VVUUm4Al80uWJBje4UZHirrf39wI7uI'}
                  title="kahoot"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div" sx={{ height: '130px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '16px' }}>
                    {detail &&
                    (<b>{detail.name}</b>)
                    }
                    <p>number of questions: {detail &&
                      (<b>{detail.questions.length}</b>)
                      }
                    </p>
                    {detail &&
                    (<p><b>{detail.createdAt.replace('T', ' ').replace('Z', ' ').split('.')[0]}</b></p>)
                    }
                    <b> Total time: {totalTime}s</b>
                  </Typography>
                </CardContent>
                <CardActions sx={{ flexWrap: 'wrap' }}>
                {detail &&
                  start === '1'
                  ? <>
                      <Button id='stopGame' size="small" variant="contained" color="error" onClick = {stopGame(data.id) }>stop</Button>
                      <Button sx={{ position: 'relaive', left: '38%' }} variant="contained" size="small" onClick = {() => advance(data.id)}>advance</Button>
                    </>
                  : start === '2'
                    ? <>
                      <Button size="small" variant="outlined" startIcon={<DeleteIcon />} onClick={Delete(data.id)}>Delete</Button>
                      <Button id='editGame' size="small" variant="outlined" onClick={ () => { navigate(`/editgame/${data.id}`) } } >Edit</Button>
                      <Button id='startGame' size="small" variant="contained" color="success" onClick={ startGame(data.id) }>start</Button>
                      <div style={{ marginTop: '16px' }}>
                      <Button size="small" variant="contained" color="success" onClick={() => navigate('/history/' + data.id) }>history</Button>
                      </div>
                    </>
                    : <></>
                }
                <Dialog
              open={openStart}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogContent>
                <DialogTitle>{localStorage.getItem('gameName')}</DialogTitle>
                <DialogContentText id="alert-dialog-description">
                  game start
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button id='CopyLink' onClick={handleClose}>Copy Link</Button>
              </DialogActions>
            </Dialog>
            <Dialog
              open={openClose}
              onClose={handleCloseEnd}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                Would you like to view the results?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button id='yes' onClick={() => handleCloseEndrul()}>yes</Button>
                <Button onClick={handleCloseEnd} autoFocus> no </Button>
              </DialogActions>
            </Dialog>
                </CardActions>
            </Card>

        </Box>
    );
  }
  return (
        <>
            <DashboardBtn></DashboardBtn>
            <br /><hr /><br />
            <div style = {{ position: 'relative', bottom: '20px' }} >
              <Button id='createGame' variant="contained" color="secondary" onClick={() => navigate('/dashboard/newgame')}>
                  create new game
              </Button>
            </div>
            <GameStack direction="row" spacing={10} sx = {{ background: 'rgb(240, 239, 239)' }} >
                {quizzes.map((Gamedata, index) => (
                  <QuizMap key = {Gamedata.id} gameindex = {index} id = {Gamedata.id}></QuizMap>
                ))}

                </GameStack>

        </>
  )
}

export default Dashboard;
