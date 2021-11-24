import React, { useEffect } from 'react';
import { useWeb3React  } from '@web3-react/core';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import useEth from '../hooks/useEth';
import { useGameToken } from '../hooks/useGameToken'
import { useAppContext } from '../AppContext';

const useStyles = makeStyles({
  root: {
    minWidth: 250,
    maxHeight: 100
  }
});


const TokenBalance = () => {
  const { setTokenBalance, gameResult } = useAppContext();
  const { account, chainId, active } = useWeb3React();
  
  const { fetchTokenBalance, tokenBalance } = useGameToken();

  useEffect(() => {
    if (account && active) {
      fetchTokenBalance();
    } else {
      setTokenBalance("--");
    }
  }, [account, active, chainId, gameResult]);

  return (
    <Typography variant="body2" component="p">
      JSD ballance: {tokenBalance}
    </Typography>
  )
}


const BallanceCard = () => {
  const classes = useStyles();
  const { account, chainId, active } = useWeb3React();
  const { fetchEthBalance, ethBalance } = useEth();
  const { setEthBalance } = useAppContext();

  useEffect(() => {
    if (account && active) {
      fetchEthBalance();
    } else {
      setEthBalance("--");
    }
  }, [account]);

  return (
    <div className={classes.root}>
      <Typography variant="body2" component="p">
        ETH ballance: {ethBalance}
      </Typography>
      { 
        !(active && chainId) && <Typography variant="body2" component="p">
          JSD ballance: -- 
        </Typography>
      }
      {active && chainId && <TokenBalance /> }
    </div>
  );
}

export default BallanceCard;