// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "forge-std/Test.sol";

import "src/OrcaCoin.sol";

contract OrcaCoinTest is Test {
    OrcaCoin c;

    function setUp() public {
        c = new OrcaCoin();
    }

    function testInitialSupply() public {
        assertEq(c.totalSupply(), 0, "Initial supply should be 0");
    }

    function testMint() public {
        vm.startPrank(address(this));
        c.putStakingContract(address(this));
        c.mint(0x00c920447cA731170929365bc5883713402d0719, 100);
        assertEq(
            c.balanceOf(0x00c920447cA731170929365bc5883713402d0719),
            100,
            "Balance should be 100"
        );
    }
}
