import React, { createContext, useReducer } from 'react';

const initialContext = {
  ethBalance: '--',
  setEthBalance: () => {},
  tokenBalance: '--',
  setTokenBalance: () => {},

  appError: undefined,
  setAppError: () => {},

  gameId: undefined,
  setGameId: () => {},

  commitedMove: undefined,
  setCommitedMove: () => {},

  isRevealed: false,
  setIsRevealed: () => {},
  
  opponentAccount: undefined,
  setOpponentAccount: () => {},

  opponentCommited: false,
  setOpponentCommited: () => {},

  opponentRevealed: false,
  setOpponentRevealed: () => {},

  gameResult: undefined,
  setGameResult: () => {}
};

const appReducer = (state, { type, payload }) => {
  switch (type) {
    case 'SET_ETH_BALANCE':
      return {
        ...state,
        ethBalance: payload,
      };
    case 'SET_TOKEN_BALANCE':
      return {
        ...state,
        tokenBalance: payload,
      };
    case 'SET_TXN_STATUS':
      return {
        ...state,
        txnStatus: payload,
      };
    case 'SET_APP_ERROR':
        return {
          ...state,
          appError: payload,
        };
    case 'SET_GAME_ID':
      return {
        ...state,
        gameId: payload,
      };          
    case 'SET_COMMITED_MOVE':
      return {
        ...state,
        commitedMove: payload,
      };
    case 'SET_IS_REVEALED':
        return {
          ...state,
          isRevealed: payload,
        };
    case 'SET_OPPONENT_ACCOUNT':
      return {
        ...state,
        opponentAccount: payload,
      };
    case 'SET_GAME_RESULT':
      return {
        ...state,
        gameResult: payload,
      };
    case 'SET_OPPONENT_REVEALED':
      return {
        ...state,
        opponentRevealed: payload,
      };
    case 'SET_OPPONENT_COMMITED':
      return {
        ...state,
        opponentCommited: payload,
      };
    
    default:
      return state;
  }
};

const AppContext = createContext(initialContext);
export const useAppContext = () => React.useContext(AppContext);
export const AppContextProvider = ({ children }) => {
  const [store, dispatch] = useReducer(appReducer, initialContext);

  const contextValue = {
    ethBalance: store.ethBalance,
    setEthBalance: (balance) => {
      dispatch({ type: 'SET_ETH_BALANCE', payload: balance });
    },
    tokenBalance: store.tokenBalance,
    setTokenBalance: (balance) => {
      dispatch({ type: 'SET_TOKEN_BALANCE', payload: balance });
    },
    appError: store.appError,
    setAppError: (str) => {
      dispatch({ type: 'SET_APP_ERROR', payload: str });
    },
    gameId: store.gameId,
    setGameId: (gameId) => {
      dispatch({ type: 'SET_GAME_ID', payload: gameId });
    },
    selectedMove: store.selectedMove,
    setSelectedMove: (selectedMove) => {
      dispatch({ type: 'SET_SELECTED_MOVE', payload: selectedMove });
    },
    commitedMove: store.commitedMove,
    setCommitedMove: (commitedMove) => {
      dispatch({ type: 'SET_COMMITED_MOVE', payload: commitedMove });
    },
    isRevealed: store.isRevealed,
    setIsRevealed: (isRevealed) => {
      dispatch({ type: 'SET_IS_REVEALED', payload: isRevealed });
    },
    opponentAccount: store.opponentAccount,
    setOpponentAccount: (opponentAccount) => {
      dispatch({ type: 'SET_OPPONENT_ACCOUNT', payload: opponentAccount });
    },
    opponentCommited: store.opponentCommited,
    setOpponentCommited: (opponentCommited) => {
      dispatch({ type: 'SET_OPPONENT_COMMITED', payload: opponentCommited });
    },
    opponentRevealed: store.opponentRevealed,
    setOpponentRevealed: (opponentRevealed) => {
      dispatch({ type: 'SET_OPPONENT_REVEALED', payload: opponentRevealed });
    },
    gameResult: store.gameResult,
    setGameResult: (gameResult) => {
      dispatch({ type: 'SET_GAME_RESULT', payload: gameResult });
    }
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};
