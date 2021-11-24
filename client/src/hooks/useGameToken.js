import { useContract } from './useContract';
import GameToken from '../contracts/GameToken.json';
import { useWeb3React } from '@web3-react/core';
import { useAppContext } from '../AppContext';
import { formatUnits } from '@ethersproject/units';

export const useGameToken = () => {
  const { account, chainId } = useWeb3React();
  const tokenContractAddress = GameToken.networks[chainId].address;
  const tokenContract = useContract(tokenContractAddress, GameToken.abi);
    
  const { setTokenBalance, tokenBalance } = useAppContext();

  const fetchTokenBalance = async () => {
    try {
      const tokenBalance = await tokenContract.balanceOf(account);
      setTokenBalance(formatUnits(tokenBalance, 8));
    } catch (error) {
      const tokenBalance = "--";
      setTokenBalance(tokenBalance);
    }
  };

  return {
    tokenBalance,
    fetchTokenBalance
  };
};
