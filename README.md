# Orca Staking DApp

A decentralized application (DApp) for staking Sepolia ETH and earning **OrcaCoin (ORCA)** token rewards, built with React, TypeScript, Wagmi, and Foundry.

## How It Works

This DApp lets users stake their Sepolia ETH into a smart contract and earn ORCA ERC20 tokens as rewards over time.

1. **Stake ETH** — You deposit Sepolia ETH into the `StakingContract`. Your ETH is locked in the contract and starts generating rewards immediately.
2. **Earn Rewards** — Rewards accumulate every second based on: `time staked × staked balance × reward rate (1e15)`. The longer and more you stake, the more ORCA you earn.
3. **Claim Rewards** — When you claim, the `StakingContract` calls `OrcaCoin.mint()` to create new ORCA tokens and send them to your wallet. These are ERC20 tokens visible in MetaMask.
4. **Unstake ETH** — Withdraw some or all of your staked ETH at any time. Unclaimed rewards are preserved.

### The Two Contracts

| Contract | Role |
|---|---|
| **OrcaCoin** (`OrcaCoin.sol`) | ERC20 token. Only the StakingContract can mint new tokens. |
| **StakingContract** (`StakingContract.sol`) | Holds staked ETH, tracks balances/timestamps, calculates rewards, and mints ORCA when users claim. |

## Features
- **Wallet Connection**: Support for MetaMask and other wallets via ConnectKit.
- **Staking**: Stake Sepolia ETH to the smart contract.
- **Unstaking**: Withdraw staked Sepolia ETH.
- **Rewards**: View pending ORCA rewards in real-time and claim them with one click.
- **Multi-Chain Support**: Configured for Sepolia Testnet (default) and Local Anvil Devnet.

## Project Structure
- `src/`: Solidity smart contracts (`StakingContract.sol`, `Contract.sol`).
- `frontend/`: React + TypeScript frontend application.
- `lib/`: Foundry dependencies (OpenZeppelin).

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- [Git](https://git-scm.com/)
- [MetaMask](https://metamask.io/) installed in your browser.

### Deployed Contracts (Sepolia Testnet)
The contracts are already deployed on Sepolia:

| Contract | Address |
|---|---|
| **OrcaCoin** | `0x4860a926b4F7994D17Fb85729BD0352FC63227Fa` |
| **StakingContract** | `0x336fE99D931cB4c275b9e1f1c9c0AFf5eD0B5542` |

### 1. Smart Contract Deployment (If Redeploying)

**Using Foundry:**
```bash
# 1. Deploy OrcaCoin (with zero address as placeholder)
forge create --broadcast --private-key <PRIVATE_KEY> src/OrcaCoin.sol:OrcaCoin --constructor-args 0x0000000000000000000000000000000000000000

# 2. Deploy StakingContract (with OrcaCoin address)
forge create --broadcast --private-key <PRIVATE_KEY> src/StakingContract.sol:StakingContract --constructor-args <ORCACOIN_ADDRESS>

# 3. Link OrcaCoin to StakingContract
cast send <ORCACOIN_ADDRESS> "updateStakingContract(address)" <STAKING_ADDRESS> --private-key <PRIVATE_KEY> --rpc-url <RPC_URL>
```

> **Note:** Place `--private-key` before `--constructor-args` to avoid argument parsing issues.

### 2. Frontend Setup
1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install --legacy-peer-deps
    ```
3.  Configure Contract Addresses:
    - Open `src/constants.ts` (already configured with the deployed addresses above).
    - If you redeployed, update the addresses:
      ```typescript
      export const STAKING_CONTRACT_ADDRESS = "0x336fE99D931cB4c275b9e1f1c9c0AFf5eD0B5542" as const;
      export const ORCA_COIN_ADDRESS = "0x4860a926b4F7994D17Fb85729BD0352FC63227Fa" as const;
      ```

### 3. Run the Application
Start the development server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

## Private Key Recovery (Development Only)
If you need to recover the private key from a development mnemonic (e.g., for deployment scripts), you can use the verification script:
```bash
node get-wallet.js
```
*Note: Never share your real private keys or mnemonics.*

## Technologies
- **Frontend**: Vite, React, TypeScript, Tailwind CSS
- **Web3**: Wagmi, Viem, TanStack Query, ConnectKit
- **Contracts**: Solidity, Foundry, OpenZeppelin
