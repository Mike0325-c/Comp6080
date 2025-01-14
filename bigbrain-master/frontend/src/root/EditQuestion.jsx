import React, { useEffect, useRef } from 'react';
import Button from '@mui/material/Button';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { styled } from '@mui/system';
import { apiCall, fileToDataUrl } from '../components/HelpFunctions';
import DashboardBtn from '../components/DashboardBtn';

const TextFieldADD = styled(TextField)({
  marginBottom: '20px'
})
// create a new question page
const EditQuestion = () => {
  const navigate = useNavigate();
  const param = useParams();
  const location = useLocation();
  const [type, setType] = React.useState('');
  const [time, setTime] = React.useState(0);
  const [answerList, setAnswerList] = React.useState([]);
  const [trueAnswerList, setTrueAnswerList] = React.useState([]);
  const [name, setName] = React.useState('');
  const [point, setPoint] = React.useState(0);
  const [img, setImg] = React.useState('');
  console.log(name, point, img);

  const [gamename, setGamename] = React.useState('');
  const [thumbnail, setThumbnail] = React.useState('');
  // question type
  const [totalQuestion, setTotalQuestion] = React.useState([]);
  console.log(totalQuestion, 'totalquestion');
  console.log(gamename);

  const questionImg = (event) => {
    const file = event.target.files[0];
    fileToDataUrl(file).then((data) => {
      setImg(data);
    });
  };

  function AddAnswer () {
    if (answerList.length === 6) {
      return;
    }
    let emptylist = [];
    emptylist = [...answerList];
    emptylist.push('');
    setAnswerList(emptylist);
  }

  useEffect(() => {
    apiCall(`/admin/quiz/${param.gameid}`, 'GET', {}).then(data => {
      if (data.error) {
        alert(data.error);
      } else {
        setTotalQuestion(data.questions);
        setGamename(data.name);
        setThumbnail(data.thumbnail);
        const questionIndex = data.questions.findIndex(q => q.id === param.questionid)
        if (questionIndex >= 0) {
          const currentQuestion = data.questions[questionIndex]
          setType(currentQuestion.type)
          setTime(currentQuestion.time)
          setPoint(currentQuestion.point)
          setImg(currentQuestion.img)
          setName(currentQuestion.name)
          setAnswerList(currentQuestion.answerList)
          setTrueAnswerList(currentQuestion.trueAnswerList)
        }
      }
    })
  }, [])
  const removeTrueAnswer = (answer) => {
    let emptylist = [];
    emptylist = [...trueAnswerList];
    const removeIndex = emptylist.findIndex(ans => ans === answer)
    emptylist.splice(removeIndex, 1);
    setTrueAnswerList(emptylist);
  }
  const removeAnswer = (answer) => {
    let emptylist = [];
    emptylist = [...answerList];
    const removeIndex = emptylist.findIndex(ans => ans === answer)
    emptylist.splice(removeIndex, 1);
    setAnswerList(emptylist);
  }
  const answerRefs = useRef([]);
  const onTureAnswerChange = (index) => {
    if (type === 'single') {
      setTrueAnswerList([answerList[index]])
    } else {
      setTrueAnswerList([...trueAnswerList, answerList[index]])
    }
  }
  // render the input element for new answers
  function AnswerRender () {
    return (
      <>
       {answerList.map((item, index) => (
          <div key={Math.random()} >
            <Button onClick={() => { removeAnswer(item) }}>Remove</Button>
            <input id="outlined-basic"
            style={{ width: '50%' }}
            size='small'
            value = { item }
            onFocus={() => { answerRefs.current[index].focus() }}
            ref={el => { answerRefs.current[index] = el; return answerRefs.current[index]; }}
            onChange={(e) => { const newAnswers = [...answerList]; newAnswers[index] = e.target.value; setAnswerList([...newAnswers], () => answerRefs.current[index].focus()); }}
            />
            {trueAnswerList.indexOf(item) < 0 && <Button variant="outlined" onClick={() => { onTureAnswerChange(index) }}>
              set true
            </Button>}
            {trueAnswerList.indexOf(item) >= 0 && <Button sx={{ backgroundColor: 'red' }} variant="outlined" onClick={() => { removeTrueAnswer(index) }}>
              set false
            </Button>}
            <br />
          </div>
       ))}
      </>
    )
  }

  const handleChange = (event) => {
    setType(event.target.value);
    console.log(event.target.value);
  };

  console.log(time);
  // save the change of questions for a game
  function saveQuestion () {
    apiCall(`/admin/quiz/${param.gameid}`, 'GET', {}).then(data => {
      if (data.error) {
        alert(data.error);
      } else {
        console.log(location.pathname.split('/')[1]);
        const l = {};
        l.id = param.questionid;
        l.name = name;
        l.type = type === 1 ? 'single' : 'multiple';
        l.time = time;
        l.point = point;
        l.img = img || 'https://cdn.mos.cms.futurecdn.net/oRMtEHPj8CxAvJ5P9BUp36.jpg';
        l.answerList = answerList;
        const filteredList = trueAnswerList.filter((answer) => answerList.includes(answer));
        setTrueAnswerList({ ...filteredList })
        l.trueAnswerList = filteredList
        console.log(l);
        let o = [];
        o = totalQuestion;
        const questionIndex = totalQuestion.findIndex(q => { return q.id === param.questionid })
        if (questionIndex >= 0) {
          o[questionIndex] = l
        } else {
          o.push(l);
        }
        console.log(o);
        const res = apiCall(`/admin/quiz/${param.gameid}`, 'PUT',
          {
            questions: o,
            name: gamename,
            thumbnail
          });
        res.then((data) => {
          if (data.error) {
            alert(data.error);
          } else {
            console.log(data)
          }
        })
      }
    })
    navigate(`/dashboard/newquestion/${param.gameid}`);
  }
  return (
    <>
      <DashboardBtn></DashboardBtn>
      <Button variant="outlined" color="error" sx={{ position: 'relative', right: '43%', top: '3%' }} onClick={() => { navigate(`/editgame/${param.gameid}`) } }>
          Return
      </Button>
      <div><h1>Edit your question!</h1></div>
      <div style={{ display: 'flex', width: '90%' }}>
        <Box
          sx={{
            width: '90%',
            maxWidth: '100%',
            marginRight: '10%'
          }}
        >
          <TextFieldADD sx={{ width: '50%' }} value={name} label="question name" id="fullWidthQuestion" aria-label='name of question' onChange={(e) => setName(e.target.value)}/>
          <div>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-helper-label" aria-label='type of question'>type</InputLabel>
                <Select
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  value={type}
                  label="type"
                  onChange={handleChange}
                >
                  <MenuItem value='single'>Single choice question</MenuItem>
                  <MenuItem value='multiple'>Multiple choices question</MenuItem>
                </Select>
            </FormControl>
          </div>
          <TextFieldADD value={time} sx={{ width: '20%' }} type='number' id="filled-basic" label="Time limit" variant="filled" aria-label='time of question' onChange={(e) => { setTime(e.target.value) }}/>
          <br /><br />
          <TextFieldADD value={point} sx={{ width: '20%' }} type='number' id="filled-basic" label="Points" variant="filled" aria-label='point of question' onChange={(e) => { setPoint(e.target.value) }} /> <br /><br />
          <TextFieldADD id="Media upload" label="Youtube link / encoded image" variant="outlined" aria-label='img of question' sx={{ width: '50%', mr: 2 }} onChange={(e) => { setImg(e.target.value) }}/> <br />
          <input type="file" accept="image/jpeg, image/jpg" aria-label='Enter your img' style={{ marginLeft: '7%', marginTop: '2%' }} onChange={ questionImg } />
        </Box>
        <Box
          sx={{
            width: '110%',
            border: '2px solid black',
            textAlign: 'center',
            position: 'relative',
            right: '16%'
          }}
        >
          <span>answer</span> <br /> <Button onClick={AddAnswer}>add Answer</Button>  <br />
          <AnswerRender></AnswerRender>
        </Box>
      </div>
      <Box component="span" sx={{ p: 1.2, border: '1px dashed grey' }}>
        <Button id='confirmQuestion' onClick={saveQuestion}>Confirm</Button>
      </Box>
    </>

  );
}

export default EditQuestion;
