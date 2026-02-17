// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import {
    ERC20
} from "lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "lib/openzeppelin-contracts/contracts/access/Ownable.sol";

contract OrcaCoin is ERC20, Ownable {
    address public stakingContract;

    constructor(
        address _staking
    ) ERC20("OrcaCoin", "ORCA") Ownable(msg.sender) {
        stakingContract = _staking;
    }

    function updateStakingContract(address _staking) external onlyOwner {
        require(_staking != address(0), "Invalid staking");
        stakingContract = _staking;
    }

    function mint(address _to, uint256 _amount) external {
        require(msg.sender == stakingContract, "Not authorized");
        require(_to != address(0), "Zero address");
        require(_amount > 0, "Zero amount");

        _mint(_to, _amount);
    }
}
