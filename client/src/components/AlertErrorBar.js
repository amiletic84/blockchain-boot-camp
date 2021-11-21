import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { useAppContext } from '../AppContext';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function AlertErrorBar() {
  const { appError, setAppError } = useAppContext();

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAppError('');
  };

  return (
    <Snackbar open={!!appError} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="error">
        {appError}
      </Alert>
    </Snackbar>
  )
};
