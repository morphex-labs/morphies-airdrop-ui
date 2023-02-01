import { BaseProvider } from '@ethersproject/providers';
import { BigNumber, ethers } from 'ethers';
import { useQuery } from 'react-query';
import { useAccount } from 'wagmi';
import { useNetworkProvider } from '~/hooks';
import { bonderABI } from '~/lib/abis/bonder';
import { TokenABI } from '~/lib/abis/token';
import { BONDER_USDC, MPX_ADDRESS, USDC_ADDRESS } from '~/lib/contracts';
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
      const bondingTokenContract = new ethers.Contract(USDC_ADDRESS, TokenABI, provider);
      const mpxTokenContract = new ethers.Contract(MPX_ADDRESS, TokenABI, provider);
      const bonderContract = new ethers.Contract(BONDER_USDC, bonderABI, provider);

      const [usdcBalance, bonderMpxBalance, minCap, maxCap, ratio, contributions]: BigNumber[] = await Promise.all([
        bondingTokenContract.balanceOf(userAddress),
        mpxTokenContract.balanceOf(BONDER_USDC),
        bonderContract.minCap(),
        bonderContract.maxCap(),
        bonderContract.ratio(),
        bonderContract.contributions(userAddress),
      ]);

      const trueContributions = Number(ethers.utils.formatUnits(contributions, 6)).toFixed(0);
      const trueMinCap = Number(ethers.utils.formatUnits(minCap, 6)).toFixed(0);
      const trueMaxCap = ethers.utils.commify(Number(ethers.utils.formatUnits(maxCap, 6)).toFixed(0));
      const trueRatio = ((1 / Number(ratio)) * 1000).toFixed(2);

      const bonderMpxBalanceFormatted = Number(ethers.utils.formatUnits(bonderMpxBalance, 18)).toFixed(0);
      const bonderMpxBalanceUSD = (Number(bonderMpxBalanceFormatted) * Number(trueRatio)).toFixed(2);

      const bonderMpxBalanceCommified = ethers.utils.commify(bonderMpxBalanceFormatted);
      const bonderMpxBalanceUSDCommified = ethers.utils.commify(bonderMpxBalanceUSD);
      const usdcBalanceFormatted = ethers.utils.commify(Number(ethers.utils.formatUnits(usdcBalance, 6)).toFixed(0));

      const tokenBalance = ethers.utils.formatUnits(usdcBalance, 6);

      const result: IBonding = {
        tokenBalance: tokenBalance,
        tokenBalanceDisplay: usdcBalanceFormatted,
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

export default function useGetBondingInfoUsdc() {
  const { provider, chainId } = useNetworkProvider();
  const [{ data: accountData }] = useAccount();
  return useQuery(
    ['bondingInfoUsdc', accountData?.address, chainId],
    () => getBondingInfo(accountData?.address, provider, chainId),
    {
      refetchInterval: 20000,
    }
  );
}
