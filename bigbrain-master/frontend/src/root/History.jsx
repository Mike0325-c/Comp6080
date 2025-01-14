import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiCall } from '../components/HelpFunctions';
import Button from '@mui/material/Button';
function History () {
  const param = useParams();
  const navigate = useNavigate();
  const [oldSessions, setOldSessions] = useState();
  useEffect(() => {
    apiCall(`/admin/quiz/${param.gameid}`, 'GET', {}).then((res) => {
      if (res.error) {
        alert(res.error);
      } else {
        setOldSessions(res.oldSessions);
      }
    });
  }, []);
  return (
    <div>
      <Button variant="outlined" color="error" sx={{ position: 'relative', left: '30%' }} onClick={() => { navigate('/dashboard') } }>
          Return
      </Button>
        {oldSessions && oldSessions.map(session => <a key={session} onClick={() => navigate('/result/' + session)}>{session}</a>)}
    </div>
  )
}
export default History;
