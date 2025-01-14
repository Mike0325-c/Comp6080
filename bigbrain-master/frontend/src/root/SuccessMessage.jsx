import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Slide from '@mui/material/Slide';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const Transition = React.forwardRef(function Transition (props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

//  the page when successfully create a new question and a new game
function SuccessMsg () {
  const navigate = useNavigate();
  const param = useParams();
  const location = useLocation();
  const [open, setOpen] = React.useState(true);
  const [path, setPath] = React.useState('');
  console.log(location.pathname.split('/')[2]);

  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    const url = location.pathname.split('/')[2] === 'newgame' ? '/dashboard' : `/editgame/${param.name}`;
    setPath(url);
  }, [])

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Successfully created!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button id='confirm' role='confirm' onClick={() => { navigate(path) } }>Confirm</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default SuccessMsg;
