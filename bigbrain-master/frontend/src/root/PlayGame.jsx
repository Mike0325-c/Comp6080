import React, { useState, useEffect } from 'react';
import { Button, Radio, RadioGroup, FormControlLabel, Checkbox, FormGroup } from '@mui/material';
import TextField from '@mui/material/TextField';
import { apiCall } from '../components/HelpFunctions';
import { useParams } from 'react-router-dom';
import Lobby from '../components/Lobby';
const PlayGame = () => {
  const [time, setTime] = useState();
  const [question, setQuestion] = useState();
  const param = useParams();
  const [playerName, setName] = useState()
  const [player1, setPlayer1] = useState()
  const [status, setStatus] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});
  const [answer, setAnswer] = useState('');
  const handleSingleChange = (event) => {
    setAnswer(event.target.value);
  };
  const handleMultipChange = (event) => {
    setCheckedItems({
      ...checkedItems,
      [event.target.name]: event.target.checked,
    });
  };
  useEffect(() => {
    const interval = setInterval(() => {
      if (time >= 0) {
        setTime((prevTime) => prevTime - 1);
      }
      if (time <= 0) {
        const res = apiCall('/play/' + player1 + '/answer')
        res.then(data => {
          const correctAnswers = data.answerIds.join(', ')
          alert('Correct answer is :' + correctAnswers)
        })
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [time]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (player1) {
        console.log('aaaa')
        const res = apiCall('/play/' + player1 + '/question', 'GET')
        res.then(data => {
          if (data.question) {
            if (!(question && question.id === data.question.id)) {
              setQuestion({ ...data.question })
              const timeLastQuestionStarted = new Date(data.question.isoTimeLastQuestionStarted);
              const timeDiffInSeconds = Math.floor((new Date() - timeLastQuestionStarted) / 1000);
              const remainingTime = Math.max(data.question.time - timeDiffInSeconds, 0);
              console.log('remaining time:' + remainingTime)
              setTime(remainingTime) // left time
              setStatus(true)
            }
          }
        })
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [player1, question])

  const handleNameChange = (event) => {
    setName(event.target.value);
  }

  const handleSubmit = () => {
    let answerIds = [];
    if (question.type === 'single') {
      console.log(answer)
      answerIds.push(answer)
    } else {
      console.log(checkedItems)
      answerIds = Object.keys(checkedItems);
    }
    // handle submitting the answer
    apiCall('/play/' + player1 + '/answer', 'PUT', { answerIds })
  };
  const startGame = () => {
    const res = apiCall('/play/join/' + param.sessionid, 'POST', { name: playerName })
    res.then((data) => {
      if (data.error) {
        alert(data.error);
      } else {
        const playerId = data.playerId;
        console.log('@@@@@' + playerId)
        setName('aaaaaa111')
        setPlayer1(playerId)
        setTimeout(() => {
          console.log('@@@@@' + player1)
        }, 2000)
        const res1 = apiCall('/play/' + data.playerId + '/status', 'GET')
        res1.then(data => setStatus(data.status))
      }
    })
  }
  return (
    <>
    {player1 && status && <div>
      <img src={question.img} alt={question.name} style={{ width: '50px' }}/>
      <p>{question.name}</p>
      {question.type === 'single' && <RadioGroup name='gender' value={answer} onChange={handleSingleChange}>
  {question.answerList.map(answer => <FormControlLabel key={answer} value={answer} control={<Radio />} label={answer} />)}
</RadioGroup> }
      {question.type === 'multiple' && <FormGroup>
  {question.answerList.map(answer => <FormControlLabel
        key={answer}
        control={<Checkbox name={answer} />}
        label={answer}
        checked={checkedItems.option1}
        onChange={handleMultipChange}
      />)}
  </FormGroup>}
      <Button variant='contained' onClick={() => handleSubmit()}>Submit</Button>
      <p>Time remaining: {time} seconds</p>
    </div>}
    {
        player1 && !status && <Lobby />
    }
    {
        !player1 && <div>
            <TextField
                label='Name'
                variant='outlined'
                value={playerName}
                onChange={handleNameChange}
                name='myName'
            />
            <Button onClick={() => startGame() }>Start</Button>
        </div>
    }
    </>
  );
}

export default PlayGame;
