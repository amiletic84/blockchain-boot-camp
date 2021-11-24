

import React from 'react';
import { useWeb3React } from '@web3-react/core';
import { makeStyles } from '@material-ui/core/styles';

import { useAppContext } from '../AppContext';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

import { useRockPaperScissors } from '../hooks/useRockPaperScissors';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { shortenAddress } from '../utils/shortenAddress'

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 350
  },
  button: {
    '& > *': {
      margin: theme.spacing(1),
    },
  }
}));

const GameCard = () => {
  const [move, setMove] = React.useState('1');
  const handleChange = (event) => {
    setMove(event.target.value);
  };

  const classes = useStyles();
  const { active, account } = useWeb3React();
  const { 
    gameId, 
    commitedMove, 
    isRevealed, 
    opponentCommited, 
    opponentAccount,
    opponentRevealed, 
    gameResult 
  } = useAppContext();
  const { 
    registerNewGame, 
    resetGameContext, 
    commitMove, 
    readGameState, 
    revealMove, 
    setGameEventListener, 
    removeListeners 
  } = useRockPaperScissors()

  const commit = async () => {
    await commitMove(gameId, move);
  }

  const reveal = async () => {
    await revealMove(gameId, commitedMove);
  }

  const registerGame = async () => {
    resetGameContext();
    const id = await registerNewGame();
    if (id) {
      await readGameState(id);
      await removeListeners();
      await setGameEventListener(id);
    }
  }

  if (active && account) {
    return (
      <div>
        <Card className={classes.root}>
          <CardActionArea>
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                  Game ID: {gameId}
              </Typography>
            </CardContent>
            <CardContent>
              <FormControl component="fieldset">
                <FormLabel component="legend">Choose move</FormLabel>
                <RadioGroup aria-label="moveChoice" name="moveChoice" value={move} onChange={handleChange}>
                  <FormControlLabel disabled={!gameId || !!commitedMove} value="1" control={<Radio />} label="Rock" />
                  <FormControlLabel disabled={!gameId || !!commitedMove} value="2" control={<Radio />} label="Papper" />
                  <FormControlLabel disabled={!gameId || !!commitedMove} value="3" control={<Radio />} label="Scissors" />
                </RadioGroup>
              </FormControl>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button color="inherit" disabled={!gameId || !!commitedMove} onClick={commit}>Commit</Button>
            <Button color="inherit" disabled={!gameId || isRevealed || !commitedMove || !opponentCommited} onClick={reveal}>Reveal</Button>
          </CardActions>
        </Card>

        <Card className={classes.root}>
          <CardActionArea>
            <CardContent>
              {gameResult && <Typography gutterBottom variant="body2" component="p">
                  Result: {gameResult}
              </Typography> }
              <Typography gutterBottom variant="h5" component="h2">
                Opponent
              </Typography>
              <Typography variant="body2" component="p">
                Account: {shortenAddress(opponentAccount)}
              </Typography>
              {opponentCommited && 
                <Typography variant="body2" component="p">
                Opponent commited move
                </Typography> 
              }
              {
                opponentRevealed && 
                <Typography variant="body2" component="p">
                Opponent revealed move
                </Typography>
              }              
            </CardContent>
          </CardActionArea>
        </Card>
        <div className={classes.button}>
          <Button variant="contained" color="secondary" onClick={registerGame}>New Game</Button>
        </div>
      </div>
    );
  }
}

export default GameCard;