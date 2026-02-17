// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./OrcaCoin.sol";

contract StakingContract {
    OrcaCoin public orca;

    mapping(address => uint256) public stakingBalance;
    mapping(address => uint256) public unclaimedRewards;
    mapping(address => uint256) public lastUpdateTime;

    uint256 public constant REWARD_RATE = 1e15;

    constructor(address _orca) {
        orca = OrcaCoin(_orca);
    }

    function stake() public payable {
        require(msg.value > 0, "Amount must be greater than 0");

        _updateRewards(msg.sender);

        stakingBalance[msg.sender] += msg.value;
        lastUpdateTime[msg.sender] = block.timestamp;
    }

    function unstake(uint256 _amount) public {
        require(stakingBalance[msg.sender] >= _amount, "Insufficient balance");

        _updateRewards(msg.sender);

        stakingBalance[msg.sender] -= _amount;

        (bool success, ) = payable(msg.sender).call{value: _amount}("");
        require(success, "Transfer failed");

        lastUpdateTime[msg.sender] = block.timestamp;
    }

    function claimRewards() public {
        _updateRewards(msg.sender);

        uint256 rewards = unclaimedRewards[msg.sender];
        require(rewards > 0, "No rewards");

        unclaimedRewards[msg.sender] = 0;

        orca.mint(msg.sender, rewards);
    }

    function getRewards(address _user) public view returns (uint256) {
        uint256 pending = (block.timestamp - lastUpdateTime[_user]) *
            stakingBalance[_user] *
            REWARD_RATE;

        return unclaimedRewards[_user] + pending;
    }

    function _updateRewards(address _user) internal {
        if (stakingBalance[_user] > 0) {
            uint256 rewards = (block.timestamp - lastUpdateTime[_user]) *
                stakingBalance[_user] *
                REWARD_RATE;

            unclaimedRewards[_user] += rewards;
        }
    }
}
