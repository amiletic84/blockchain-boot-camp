import React from 'react';
import { useWeb3React  } from '@web3-react/core';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    minWidth: 250,
    maxHeight: 100
  }
});

const BallanceCard = () => {
  const classes = useStyles();
  const { account } = useWeb3React();
  // const { fetchEthBalance, ethBalance } = useEth();
  // const { fetchCTokenBalance, cTokenBalance } = useCToken();

  // useEffect(() => {
  //   if (account) {
  //     fetchEthBalance();
  //     fetchCTokenBalance();
  //   }
  // }, [account]);

  return (
    <div className={classes.root}>
      <Typography variant="body2" component="p">
        ETH ballance: --
      </Typography>
      <Typography variant="body2" component="p">
        JSD ballance: --
      </Typography>
    </div>
  );
}

export default BallanceCard;