import { useCallback } from 'react';
import { useContract } from './useContract';
import RockPaperScissors from '../contracts/RockPaperScissors.json';
import { useWeb3React } from '@web3-react/core';
import { useAppContext } from '../AppContext';
import { BigNumber } from '@ethersproject/bignumber'
import web3 from 'web3';

import { ethers } from 'ethers';

const emptyMoveEncr = "0x0000000000000000000000000000000000000000000000000000000000000000";

export const useRockPaperScissorsContract = () => {
  const { chainId } = useWeb3React();
  const contractAddress = RockPaperScissors.networks[chainId].address;

  return useContract(contractAddress, RockPaperScissors.abi);
};

export const useRockPaperScissors = () => {
  const { setAppError, setGameId, setCommitedMove, setIsRevealed, setOpponentAccount, setOpponentCommited, setOpponentRevealed, setGameResult } = useAppContext();

  const { account } = useWeb3React();
  const contract  = useRockPaperScissorsContract();

  const registerNewGame = async () => {
    try {
      const result = await contract.register({
        from: account
      });
      const receipt = await result.wait(1);
      const newGameId = Number(receipt.events[0].args.gameId);
      setGameId(newGameId);
      return newGameId;
    }
    catch (error) {
      setAppError(`Error executing register transaction`)
    }
  };

  const commitMove = async (id, move) => {
    try {
      const plainMove = `${move}${web3.utils.randomHex(4)}`;
      const result = await contract.commit(
        BigNumber.from(Number(id)), web3.utils.soliditySha3(plainMove),
        {
          from: account
        });
      await result.wait(1);
      setCommitedMove(plainMove);
    }
    catch (error) {
      setAppError(`Error executing commit transaction`)
    }
  };

  const revealMove = async (id, plainMove) => {
    try {
      const result = await contract.reveal(BigNumber.from(Number(id)), plainMove, {from: account});
      await result.wait(1);
      setIsRevealed(true);
    }
    catch (error) {
      setAppError(`Error executing reveal transaction`)
    }
  };

  const setGameEventListener = async (id) => {
    // event PlayerRegistered(address player, uint gameId)
    contract.on("PlayerRegistered", (eventPlayer, eventGameId) => {
      if (
        Number(eventGameId) == Number(id) && 
        eventPlayer !== account) {
        setOpponentAccount(eventPlayer);
      }
    });

    // event MoveCommited(address player, uint gameId);
    contract.on("MoveCommited", (eventPlayer, eventGameId) => {
      if (Number(eventGameId) == Number(id) && 
        eventPlayer !== account) {
        setOpponentCommited(eventPlayer);
      }
    })

    // event GameDrawn(uint gameId);
    contract.on("GameDrawn", (eventGameId) => {
      if (Number(eventGameId) == Number(id)) {
        setGameResult("Game is drawn");
      }
    })

    // event GamerWinner(address player, uint gameId);
    contract.on("GamerWinner", (eventPlayer, eventGameId) => {
      if (Number(eventGameId) == Number(id)) {
        setGameResult(`Game winner is ${eventPlayer}`);
      }
    })
  };

  const removeListeners = async () => { 
    await contract.removeAllListeners();
  };

  const readGameState = async (id) => {
    const gameIdConverted = BigNumber.from(Number(id))
    const game = await contract.games(gameIdConverted);
    console.log("Game: ", JSON.stringify(game));
    if (game.finished) {
      if (game.winner !== ethers.constants.AddressZero) {
        // we have the winner
        setGameResult(`Game winner is ${game.winner}`);
      }
      else {
        // game is drawn
        setGameResult("Game is drawn");
      }
    }

    const opponentMove = await contract. getOpponentMove(gameIdConverted);
    console.log("Opponent: ", JSON.stringify(opponentMove));
    if (opponentMove.registered) {
      
      if (opponentMove.encrMove != emptyMoveEncr) {
        setOpponentCommited(true);
      }
    
      if (opponentMove.move != 0) {
        setOpponentRevealed(true);
      }
    }

    const players = await contract.getPlayers(gameIdConverted);
    console.log("Players: ", JSON.stringify(players));
    if (players) {
      const opponent = players.find(x => x !== account);
      if (opponent) {
        setOpponentAccount(opponent);
      }
    } 
  };

  const resetGameContext = () => {
    setGameId(undefined);
    setCommitedMove(undefined);
    setIsRevealed(false);
    setOpponentAccount(undefined);
    setOpponentCommited(false);
    setOpponentRevealed(false);
    setGameResult(undefined);
    removeListeners();
  }

  return {
    registerNewGame,
    commitMove,
    revealMove,
    setGameEventListener,
    readGameState,
    removeListeners,
    resetGameContext
  }
};
