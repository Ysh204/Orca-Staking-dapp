import {
    useAccount,
    useReadContract,
    useWriteContract,
    useWaitForTransactionReceipt,
    useChainId,
} from 'wagmi';
import { formatEther } from 'viem';
import StakingABI from '../abis/StakingContract.json';
import { STAKING_CONTRACT_ADDRESS } from '../constants';
import { useEffect, useState } from 'react';

export function Info() {
    const { address, isConnected } = useAccount();
    const chainId = useChainId();
    const [error, setError] = useState<string | null>(null);

    // Read Staked Balance
    const {
        data: stakedBalance,
        isLoading: isLoadingStake,
        refetch: refetchStaked,
    } = useReadContract({
        address: STAKING_CONTRACT_ADDRESS,
        abi: StakingABI,
        functionName: 'stakingBalance',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
        },
    });

    // Read Rewards
    const {
        data: rewards,
        isLoading: isLoadingRewards,
        refetch: refetchRewards,
    } = useReadContract({
        address: STAKING_CONTRACT_ADDRESS,
        abi: StakingABI,
        functionName: 'getRewards',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
            refetchInterval: 10000, // refresh every 10s
        },
    });

    const {
        writeContract,
        data: hash,
        isPending,
        error: writeError,
    } = useWriteContract();

    const {
        isLoading: isConfirming,
        isSuccess,
    } = useWaitForTransactionReceipt({
        hash,
    });

    useEffect(() => {
        if (isSuccess) {
            refetchStaked();
            refetchRewards();
        }
    }, [isSuccess, refetchStaked, refetchRewards]);

    useEffect(() => {
        if (writeError) {
            setError(writeError.message);
        }
    }, [writeError]);

    const handleClaim = () => {
        setError(null);

        if (!isConnected) {
            setError('Please connect your wallet.');
            return;
        }

        if (!rewards || (rewards as bigint) === 0n) {
            setError('No rewards available to claim.');
            return;
        }

        writeContract({
            address: STAKING_CONTRACT_ADDRESS,
            abi: StakingABI,
            functionName: 'claimRewards',
        });
    };

    const getExplorerUrl = () => {
        switch (chainId) {
            case 1:
                return 'https://etherscan.io';
            case 11155111:
                return 'https://sepolia.etherscan.io';
            case 5:
                return 'https://goerli.etherscan.io';
            default:
                return 'https://etherscan.io';
        }
    };

    if (!address) return null;

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-6 text-gray-800">
                Your Stats
            </h2>

            {/* Stats Cards */}
            <div className="space-y-4">
                <div className="flex justify-between bg-gray-50 p-3 rounded-md">
                    <span className="text-gray-600">Staked Amount</span>
                    <span className="font-mono font-semibold">
                        {isLoadingStake
                            ? 'Loading...'
                            : stakedBalance
                                ? `${formatEther(stakedBalance as bigint)} ETH`
                                : '0 ETH'}
                    </span>
                </div>

                <div className="flex justify-between bg-gray-50 p-3 rounded-md">
                    <span className="text-gray-600">Pending Rewards</span>
                    <span className="font-mono font-semibold text-green-600">
                        {isLoadingRewards
                            ? 'Loading...'
                            : rewards
                                ? `${formatEther(rewards as bigint)} ORCA`
                                : '0 ORCA'}
                    </span>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="mt-4 text-red-600 text-sm bg-red-50 p-2 rounded">
                    {error}
                </div>
            )}

            {/* Success */}
            {isSuccess && (
                <div className="mt-4 text-green-600 text-sm bg-green-50 p-2 rounded">
                    Rewards successfully claimed!
                </div>
            )}

            {/* Claim Button */}
            <button
                onClick={handleClaim}
                disabled={
                    !isConnected ||
                    isPending ||
                    isConfirming ||
                    !rewards ||
                    (rewards as bigint) === 0n
                }
                className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isPending
                    ? 'Waiting for Wallet...'
                    : isConfirming
                        ? 'Waiting for Confirmation...'
                        : 'Claim Rewards'}
            </button>

            {/* Transaction Link */}
            {hash && (
                <div className="mt-3 text-xs text-gray-500">
                    Tx:{' '}
                    <a
                        href={`${getExplorerUrl()}/tx/${hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline break-all"
                    >
                        {hash}
                    </a>
                </div>
            )}
        </div>
    );
}
