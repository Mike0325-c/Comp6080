import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { apiCall } from '../components/HelpFunctions';
import { useParams } from 'react-router-dom';

const columns = [
  { field: 'name', headerName: 'Name' },
  { field: 'score', headerName: 'Score' },
  { field: 'answers', headerName: 'Answers' },
];
const calculateScore = (answers) => {
  let score = 0;
  answers.forEach((answer) => {
    if (answer.questionStartedAt && answer.answeredAt) {
      const usedTime = new Date(answer.answeredAt) - new Date(answer.questionStartedAt);
      console.log(usedTime);
      score += answer.correct ? 1 : 0;
    }
  });
  return score;
};
function Result () {
  const [results, setResults] = useState(null)
  const param = useParams();
  useEffect(() => {
    const res = apiCall('/admin/session/' + param.sessionid + '/results')
    res.then(data => {
      setResults(data.results)
    })
  }, [])
  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.field}>{column.headerName}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(results) && results.map((result, index) => (
              <TableRow key={result.name}>
                <TableCell>{result.name}</TableCell>
                <TableCell>{calculateScore(result.answers)}</TableCell>
                <TableCell>{result.answers.map((answer) => answer.answerIds.join(', ')).join(' | ')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default Result;
