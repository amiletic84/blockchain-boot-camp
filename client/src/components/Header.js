import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import ConnectButton from './ConnectButton';
import AlertErrorBar from './AlertErrorBar';
import BallanceCard from './BallanceCard';
import Typography from '@material-ui/core/Typography';

import Toolbar from '@material-ui/core/Toolbar';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
}));

const Header = () => {
  const classes = useStyles();

  return (
     <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <AlertErrorBar />
            <BallanceCard />
            <Typography variant="h6" className={classes.title}>
              Rock Paper Scissors
            </Typography>
            <ConnectButton />
          </Toolbar>
        </AppBar >
     </div>
  );
};

export default Header;
