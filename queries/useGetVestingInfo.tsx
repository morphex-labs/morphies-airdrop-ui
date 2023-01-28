import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import { useQuery } from 'react-query';
import { erc20ABI, useAccount } from 'wagmi';
import { BaseProvider } from '@ethersproject/providers';
import { ContractCallContext, Multicall } from 'ethereum-multicall';

import type { IVesting } from '../types';
import { useNetworkProvider } from '../hooks';
import { networkDetails } from '../lib/networkDetails';
import { vestingEscrowABI } from '../lib/abis/vestingEscrow';
import { vestingFactoryABI } from '../lib/abis/vestingFactory';

async function getVestingInfo(userAddress: string | undefined, provider: BaseProvider | null, chainId: number | null) {
  try {
    if (!provider) {
      throw new Error('No provider');
    } else if (!userAddress) {
      throw new Error('No Account');
    } else if (!chainId) {
      throw new Error('Cannot get Chain ID');
    } else {
      const factoryAddress = networkDetails[chainId].vestingFactory;
      const factoryContract = new ethers.Contract(factoryAddress, vestingFactoryABI, provider);
      const multicall = new Multicall({ ethersProvider: provider, tryAggregate: true });

      const amtOfContracts = await factoryContract.escrows_length({ gasLimit: 1000000 });

      const runMulticall = async (calls: any[]) => {
        const pending = [];
        for (let i = 0; i < calls.length; i += 200) {
          pending.push(multicall.call(calls.slice(i, i + 200)));
        }
        return (await Promise.all(pending)).reduce((all, r) => {
          Object.assign(all, r.results);
          return all;
        }, {} as any);
      };

      const vestingContractsContext: ContractCallContext[] = Array.from({ length: Number(amtOfContracts) }, (_, k) => ({
        reference: k.toString(),
        contractAddress: factoryAddress,
        abi: vestingFactoryABI,
        calls: [{ reference: 'escrow', methodName: 'escrows', methodParameters: [k] }],
      }));
      const vestingContractsResults: any[] = await runMulticall(vestingContractsContext);
      const vestingContractInfoContext: ContractCallContext[] = Object.keys(vestingContractsResults).map((p: any) => ({
        reference: vestingContractsResults[p].callsReturnContext[0].returnValues[0],
        contractAddress: vestingContractsResults[p].callsReturnContext[0].returnValues[0],
        abi: vestingEscrowABI,
        calls: [
          { reference: 'unclaimed', methodName: 'unclaimed', methodParameters: [] },
          { reference: 'locked', methodName: 'locked', methodParameters: [] },
          { reference: 'recipient', methodName: 'recipient', methodParameters: [] },
          { reference: 'token', methodName: 'token', methodParameters: [] },
          { reference: 'startTime', methodName: 'start_time', methodParameters: [] },
          { reference: 'endTime', methodName: 'end_time', methodParameters: [] },
          { reference: 'cliffLength', methodName: 'cliff_length', methodParameters: [] },
          { reference: 'totalLocked', methodName: 'total_locked', methodParameters: [] },
          { reference: 'totalClaimed', methodName: 'total_claimed', methodParameters: [] },
          { reference: 'admin', methodName: 'admin', methodParameters: [] },
          { reference: 'disabled_at', methodName: 'disabled_at', methodParameters: [] },
        ],
      }));
      const vestingContractInfoResults = await runMulticall(vestingContractInfoContext);
      const tokenContractCallContext: ContractCallContext[] = Object.keys(vestingContractInfoResults).map((p: any) => ({
        reference: vestingContractInfoResults[p].callsReturnContext[3].returnValues[0],
        contractAddress: vestingContractInfoResults[p].callsReturnContext[3].returnValues[0],
        abi: erc20ABI,
        calls: [
          { reference: 'name', methodName: 'name', methodParameters: [] },
          { reference: 'symbol', methodName: 'symbol', methodParameters: [] },
          { reference: 'decimals', methodName: 'decimals', methodParameters: [] },
        ],
      }));
      const tokenContractCallResults: any[] = await runMulticall(tokenContractCallContext);
      const results: IVesting[] = [];

      for (const key in vestingContractInfoResults) {
        const vestingReturnContext = vestingContractInfoResults[key].callsReturnContext;
        const recipient = vestingReturnContext[2].returnValues[0].toLowerCase();
        const admin = vestingReturnContext[9].returnValues[0].toLowerCase();
        if (userAddress.toLowerCase() !== recipient && userAddress.toLowerCase() !== admin) continue;
        const tokenReturnContext = tokenContractCallResults[vestingReturnContext[3].returnValues[0]].callsReturnContext;
        results.push({
          contract: key,
          unclaimed: ethers.utils.formatUnits(vestingReturnContext[0].returnValues[0].hex, 18),
          locked: ethers.utils.formatUnits(vestingReturnContext[1].returnValues[0].hex, 18),
          recipient: recipient,
          token: vestingReturnContext[3].returnValues[0],
          tokenName: tokenReturnContext[0].returnValues[0],
          tokenSymbol: tokenReturnContext[1].returnValues[0],
          tokenDecimals: tokenReturnContext[2].returnValues[0],
          startTime: new BigNumber(vestingReturnContext[4].returnValues[0].hex).toString(),
          endTime: new BigNumber(vestingReturnContext[5].returnValues[0].hex).toString(),
          cliffLength: new BigNumber(vestingReturnContext[6].returnValues[0].hex).toString(),
          totalLocked: ethers.utils.formatUnits(vestingReturnContext[7].returnValues[0].hex, 18),
          totalClaimed: ethers.utils.formatUnits(vestingReturnContext[8].returnValues[0].hex, 18),
          admin: admin,
          disabledAt: new BigNumber(vestingReturnContext[10].returnValues[0].hex).toString(),
          timestamp: Date.now() / 1e3,
        });
      }
      return results;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default function useGetVestingInfo() {
  const { provider, chainId } = useNetworkProvider();
  const [{ data: accountData }] = useAccount();
  return useQuery(
    ['vestingInfo', accountData?.address, chainId],
    () => getVestingInfo(accountData?.address, provider, chainId),
    {
      refetchInterval: 30000,
    }
  );
}
