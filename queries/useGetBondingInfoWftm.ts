import { BaseProvider } from '@ethersproject/providers';
import { BigNumber, ethers } from 'ethers';
import { useQuery } from 'react-query';
import { useAccount } from 'wagmi';
import { useNetworkProvider } from '~/hooks';
import { bonderABI } from '~/lib/abis/bonder';
import { TokenABI } from '~/lib/abis/token';
import { BONDER_WFTM, MPX_ADDRESS, WFTM_ADDRESS } from '~/lib/contracts';
import { IBonding } from '~/types';

async function getBondingInfo(userAddress: string | undefined, provider: BaseProvider | null, chainId: number | null) {
  try {
    if (!provider) {
      throw new Error('No provider');
    } else if (!userAddress) {
      throw new Error('No Account');
    } else if (!chainId) {
      throw new Error('Cannot get Chain ID');
    } else {
      const bondingTokenContract = new ethers.Contract(WFTM_ADDRESS, TokenABI, provider);
      const mpxTokenContract = new ethers.Contract(MPX_ADDRESS, TokenABI, provider);
      const bonderContract = new ethers.Contract(BONDER_WFTM, bonderABI, provider);

      const [ftmBalance, bonderMpxBalance, minCap, maxCap, ratio, contributions]: BigNumber[] = await Promise.all([
        bondingTokenContract.balanceOf(userAddress),
        mpxTokenContract.balanceOf(BONDER_WFTM),
        bonderContract.minCap(),
        bonderContract.maxCap(),
        bonderContract.ratio(),
        bonderContract.contributions(userAddress),
      ]);

      const trueContributions = Number(ethers.utils.formatUnits(contributions, 18)).toFixed(0);
      const trueMinCap = ethers.utils.commify(Number(ethers.utils.formatUnits(minCap, 18)).toFixed(0));
      const trueMaxCap = ethers.utils.commify(Number(ethers.utils.formatUnits(maxCap, 18)).toFixed(0));
      const trueRatio = ((1 / Number(ratio)) * 1000).toFixed(2);

      const bonderMpxBalanceFormatted = Number(ethers.utils.formatUnits(bonderMpxBalance, 18)).toFixed(0);
      const bonderMpxBalanceWFTM = (Number(bonderMpxBalanceFormatted) * Number(trueRatio)).toFixed(2);

      const bonderMpxBalanceCommified = ethers.utils.commify(bonderMpxBalanceFormatted);
      const bonderMpxBalanceUSDCommified = ethers.utils.commify(bonderMpxBalanceWFTM);
      const wftmBalanceFormatted = ethers.utils.commify(Number(ethers.utils.formatUnits(ftmBalance, 18)).toFixed(0));

      const tokenBalance = ethers.utils.formatUnits(ftmBalance, 18);

      const result: IBonding = {
        tokenBalance: tokenBalance,
        tokenBalanceDisplay: wftmBalanceFormatted,
        bonderMpxBalanceFormatted: bonderMpxBalanceCommified,
        bonderMpxBalanceInToken: bonderMpxBalanceUSDCommified,
        trueContributions: trueContributions,
        trueMinCap: trueMinCap,
        trueMaxCap: trueMaxCap,
        trueRatio: trueRatio,
      };

      return result;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default function useGetBondingInfoWftm() {
  const { provider, chainId } = useNetworkProvider();
  const [{ data: accountData }] = useAccount();
  return useQuery(
    ['bondingInfoWftm', accountData?.address, chainId],
    () => getBondingInfo(accountData?.address, provider, chainId),
    {
      refetchInterval: 20000,
    }
  );
}
