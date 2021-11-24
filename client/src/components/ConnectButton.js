
import React, { useEffect} from 'react';
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core';
import { shortenAddress } from '../utils/shortenAddress'

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { injected } from "../connectors";
import { useAppContext } from '../AppContext';

const useStyles = makeStyles({
  root: {
    minWidth: 250,
    maxHeight: 100
  }
});

const ConnectButton = () => {
  const classes = useStyles();
  const { activate, active, account, deactivate } = useWeb3React();
  const { setAppError } = useAppContext();

  useEffect(() => {
    if (!window.ethereum) {
      setAppError("please install Metamask to use this app.");
      return;
    }
  }, []);

  if (active) {
    return (
      <div className={classes.root}>
        <Typography variant="body2" component="p">
            Account: {shortenAddress(account)}
        </Typography>
        <Button color="inherit" onClick={() => deactivate()}>Disconnect</Button>
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <Button color="inherit" onClick={() => { 
        if (!window.ethereum) {
          setAppError("please install Metamask to use this app.");
          return;
        }
        activate(injected, (e) => {
          if (e instanceof UnsupportedChainIdError) {
            setAppError('Unsupported network selected.');
          }
        })
      }}>Connect</Button>
    </div>
  );

};

export default ConnectButton;