import { BaseProvider } from '@ethersproject/providers';
import { BigNumber, ethers } from 'ethers';
import { useQuery } from 'react-query';
import { useNetworkProvider } from '~/hooks';
import { TokenABI } from '~/lib/abis/token';
import { WFTM_ADDRESS, USDC_ADDRESS, TREASURY_ADDRESS } from '~/lib/contracts';

async function getBondingInfo(provider: BaseProvider | null, chainId: number | null) {
  try {
    if (!provider) {
      throw new Error('No provider');
    } else if (!chainId) {
      throw new Error('Cannot get Chain ID');
    } else {
      const usdcContract = new ethers.Contract(USDC_ADDRESS, TokenABI, provider);
      const ftmContract = new ethers.Contract(WFTM_ADDRESS, TokenABI, provider);

      const [usdcBalanceBN, ftmBalanceBN]: BigNumber[] = await Promise.all([
        usdcContract.balanceOf(TREASURY_ADDRESS),
        ftmContract.balanceOf(TREASURY_ADDRESS),
      ]);

      const ftmData = await fetch('https://api.coingecko.com/api/v3/coins/fantom').then((res) => res.json());
      const ftmPrice = Number(ftmData.market_data.current_price.usd);

      const usdcBalance = Number(ethers.utils.formatUnits(usdcBalanceBN, 6));
      const ftmBalance = Number(ethers.utils.formatUnits(ftmBalanceBN, 18));
      const totalBonded = (usdcBalance + ftmBalance * ftmPrice).toFixed(0);

      return totalBonded;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default function useGetTotalBonded() {
  const { provider, chainId } = useNetworkProvider();

  return useQuery(['bondedTotal', chainId], () => getBondingInfo(provider, chainId), {
    refetchInterval: 20000,
  });
}
