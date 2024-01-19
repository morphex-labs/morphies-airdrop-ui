import { BaseProvider } from '@ethersproject/providers';
import { BigNumber, ethers } from 'ethers';
import { useNetworkProvider } from '~/hooks';
import { useQuery } from 'react-query';
import { AIRDROP_CONTRACT } from '~/lib/contracts';
import { airdropperABI } from '~/lib/abis/airdropper';

async function fetchAmount(id: string, provider: BaseProvider | null) {
  if (!provider) return BigNumber.from(0);
  try {
    const contract = new ethers.Contract(AIRDROP_CONTRACT, airdropperABI, provider);
    const airdropAmount = await contract.airdropAmounts(id);

    return BigNumber.from(airdropAmount);
  } catch (error) {
    return BigNumber.from(0);
  }
}

export function useGetAirdropAmount(id: string) {
  const { provider, network } = useNetworkProvider();

  return useQuery<BigNumber>(['airdropAmount', network, id], () => fetchAmount(id, provider));
}
