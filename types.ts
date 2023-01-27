import { Contract } from 'ethers';

export interface IToken {
  tokenAddress: string;
  spenderAddress: string;
  name: string;
  symbol: string;
  decimals: number;
  tokenContract: Contract;
  llamaTokenContract: Contract;
}

export interface ITokenList {
  [key: string]: {
    chainId: number;
    name: string;
    symbol: string;
    decimals: number;
    logoURI: string;
  };
}

export interface ITokenLists extends IToken {
  logoURI: string;
  isVerified: boolean;
}

export interface ITransactionSuccess {
  hash: string;
  wait: () => Promise<{
    status?: number | undefined;
  }>;
}

export interface ITransactionError {
  message?: string;
}

export interface ITransaction {
  data?: ITransactionSuccess;
  error?: ITransactionError;
}

export interface IVesting {
  contract: string;
  unclaimed: string;
  locked: string;
  recipient: string;
  token: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimals: number;
  startTime: string;
  endTime: string;
  cliffLength: string;
  totalLocked: string;
  totalClaimed: string;
  admin: string;
  disabledAt: string;
  timestamp: number;
  reason?: string | null;
}
