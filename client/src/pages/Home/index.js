import React from 'react';

import { useWeb3React } from '@web3-react/core';

import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

import GameCard from '../../components/GameCard';

const Home = () => {
  const { active } = useWeb3React();
  //// add select, start game, commit, reveal;
  //// add 
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="sm">
        {
          !active && 
          <Typography component="div" style={{ backgroundColor: '#cfe8fc', height: '100vh' }}>
            Not connected to the account
          </Typography>
        }
        {active && <GameCard />}
      </Container>
    </React.Fragment>
  );
};

export default Home;
