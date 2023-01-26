import { ethers, Signer } from 'ethers';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';
import type { ITransactionError, ITransactionSuccess } from '~/types';
import { useSigner } from 'wagmi';
import { migratorABI } from '~/lib/abis/migrator';

interface IUseSwapToken {
  contractAddress: string;
  amountToDeposit: string;
}

interface ISwapToken extends IUseSwapToken {
  signer?: Signer;
}

const swap = async ({ signer, contractAddress, amountToDeposit }: ISwapToken) => {
  try {
    if (!signer) {
      throw new Error("Couldn't get signer");
    } else {
      const contract = new ethers.Contract(contractAddress, migratorABI, signer);
      return await contract.deposit(amountToDeposit);
    }
  } catch (error: any) {
    throw new Error(error.message || (error?.reason ?? "Couldn't deposit token"));
  }
};

export default function useDepositToken() {
  const [{ data: signer }] = useSigner();
  const queryClient = useQueryClient();

  return useMutation<ITransactionSuccess, ITransactionError, IUseSwapToken, unknown>(
    ({ contractAddress, amountToDeposit }: IUseSwapToken) => swap({ signer, contractAddress, amountToDeposit }),
    {
      onError: (error) => {
        toast.error(error.message || "Couldn't deposit token");
      },
      onSuccess: (data) => {
        const toastId = toast.loading('Confirming Deposit');
        data.wait().then((res) => {
          toast.dismiss(toastId);

          queryClient.invalidateQueries();

          if (res.status === 1) {
            toast.success('Deposit Success');
          } else {
            toast.error('Deposit Failed');
          }
        });
      },
      onSettled: () => {
        queryClient.invalidateQueries();
      },
    }
  );
}
