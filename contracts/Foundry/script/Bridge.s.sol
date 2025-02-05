// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {Bridge} from "../src/Bridge.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract BridgeScript is Script {
    Bridge public bridge;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        bridge = new Bridge(IERC20(0xc275B23C035a9d4EC8867b47f55427E0bDCe14cB));

        vm.stopBroadcast();
    }
}
