// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "forge-std/Test.sol";

import "src/StakingContract.sol";

contract StakingContractTest is Test {
    StakingContract c;

    function setUp() public {
        c = new StakingContract();
    }

    function test_stake() public {
        c.stake{value: 2 ether}();
        console.log(c.balanceOf(msg.sender));
        c.stake{value: 2 ether}();
        console.log(c.balanceOf(msg.sender));
        c.stake{value: 2 ether}();
        assertEq(c.balanceOf(address(this)), 6 ether);
    }

    function testStakeUser() public {
        vm.startPrank(0xfF1D73Ea47222386fE482BAadb1f3d5755ea55c9);
        vm.deal(0xfF1D73Ea47222386fE482BAadb1f3d5755ea55c9, 10 ether);
        c.stake{value: 1 ether}();
        assert(
            c.balanceOf(0xfF1D73Ea47222386fE482BAadb1f3d5755ea55c9) == 1 ether
        );
    }

    function testUnstakeUser() public {
        vm.startPrank(0xfF1D73Ea47222386fE482BAadb1f3d5755ea55c9);
        vm.deal(0xfF1D73Ea47222386fE482BAadb1f3d5755ea55c9, 10 ether);
        c.stake{value: 1 ether}();
        c.unstake(1 ether);
        assert(
            c.balanceOf(0xfF1D73Ea47222386fE482BAadb1f3d5755ea55c9) == 0 ether
        );
    }

    function testClaimRewards() public {
        vm.startPrank(0xfF1D73Ea47222386fE482BAadb1f3d5755ea55c9);
        vm.deal(0xfF1D73Ea47222386fE482BAadb1f3d5755ea55c9, 10 ether);
        c.stake{value: 1 ether}();
        c.claimRewards();
        assert(
            c.getRewards(0xfF1D73Ea47222386fE482BAadb1f3d5755ea55c9) == 0 ether
        );
    }
}
