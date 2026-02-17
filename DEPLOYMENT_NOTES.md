# Deployment Troubleshooting Notes

## Errors Encountered & Fixes

### Error 1: Connection Refused (`localhost:8545`)

**Error:**
```
Error: error sending request for url (http://localhost:8545/)
- Error #1: tcp connect error
- Error #2: Connection refused (os error 111)
```

**Cause:**  
Forge ignored the `--rpc-url` CLI flag and fell back to the default `localhost:8545`. This happened because:
1. The `foundry.toml` was missing the `[profile.default]` section.
2. Forge v1.5.1 doesn't reliably pick up the `--rpc-url` flag in certain configurations.

**Fix:**  
Added `eth_rpc_url` directly in `foundry.toml`:
```toml
[profile.default]
src = "src"
out = "out"
libs = ["lib"]
eth_rpc_url = "https://eth-sepolia.g.alchemy.com/v2/<API_KEY>"
```

---

### Error 2: Private Key Not Recognized

**Error:**
```
Error: Error accessing local wallet. Did you pass a keystore, hardware wallet, private key or mnemonic?
```

**Cause:**  
The `--constructor-args` flag is **greedy** — it consumes all arguments after it as constructor arguments. So when the command was:
```bash
forge create src/OrcaCoin.sol:OrcaCoin --constructor-args 0x000...000 --private-key 0xabc...
```
Forge treated `--private-key 0xabc...` as additional constructor arguments, not as the wallet flag.

**Fix:**  
Place `--private-key` **before** `--constructor-args`:
```diff
- forge create src/OrcaCoin.sol:OrcaCoin --constructor-args 0x000...000 --private-key 0xabc...
+ forge create --private-key 0xabc... src/OrcaCoin.sol:OrcaCoin --constructor-args 0x000...000
```

---

### Error 3: Constructor Revert (`Invalid staking`)

**Error:**
```
execution reverted: Invalid staking
```

**Cause:**  
`OrcaCoin`'s constructor had a `require(_staking != address(0))` check, but we passed the zero address (`0x000...000`) because the StakingContract wasn't deployed yet (circular dependency).

**Fix:**  
Removed the zero-address check from the constructor and used a 3-step deployment:
1. Deploy `OrcaCoin` with zero address as placeholder.
2. Deploy `StakingContract` with `OrcaCoin`'s address.
3. Call `updateStakingContract()` on `OrcaCoin` with the `StakingContract` address.

---

### Error 4: Dry Run Instead of Broadcasting

**Error:**
```
Warning: Dry run enabled, not broadcasting transaction
Warning: To broadcast this transaction, add --broadcast to the previous command.
```

**Cause:**  
The `--broadcast` flag must come before the contract path. The `--constructor-args` greedy behavior was also swallowing `--broadcast` when placed after it.

**Fix:**  
Correct argument order:
```bash
forge create --broadcast --private-key <KEY> src/OrcaCoin.sol:OrcaCoin --constructor-args <ARGS>
```

---

## Key Takeaway

With `forge create`, argument order matters:
```
forge create [FLAGS] [WALLET_OPTIONS] <CONTRACT> --constructor-args <ARGS>...
```
- `--broadcast`, `--private-key`, etc. must come **before** the contract path.
- `--constructor-args` must come **after** the contract path (it's greedy and consumes everything after it).

## Final Deployed Contracts (Sepolia)

| Contract | Address |
|---|---|
| OrcaCoin | `0x4860a926b4F7994D17Fb85729BD0352FC63227Fa` |
| StakingContract | `0x336fE99D931cB4c275b9e1f1c9c0AFf5eD0B5542` |
| Deployer | `0x38948156278A632c78668A99db89A035690ad160` |
