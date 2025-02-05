// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Bridge is Ownable {
    using SafeERC20 for IERC20;

    IERC20 public token;

    mapping(address => uint256) public balances;

    event Deposited(
        address indexed from,
        string tezosRecipient,
        uint256 amount
    );

    event Withdrawn(
        address indexed to,
        uint256 amount
    );

    event Bridged(
        address indexed to,
        uint256 amount
    );

    constructor(IERC20 _token) Ownable(msg.sender) {
        token = _token;
    }

    function deposit(uint256 amount, string calldata tezosRecipient) external {
        require(amount > 0, "Le montant doit etre superieur a 0");

        token.safeTransferFrom(msg.sender, address(this), amount);

        balances[msg.sender] += amount;

        emit Deposited(msg.sender, tezosRecipient, amount);
    }

    function withdraw(uint256 amount) external {
        require(amount > 0, "Le montant doit etre superieur a 0");
        require(balances[msg.sender] >= amount, "Solde verrouille insuffisant pour l'adresse");

        balances[msg.sender] -= amount;

        token.safeTransfer(msg.sender, amount);

        emit Withdrawn(msg.sender, amount);
    }

    function getBridged(address to, uint256 amount) external onlyOwner{
        require(amount > 0, "Le montant doit etre superieur a 0");
        
        token.safeTransfer(to, amount);
        
        emit Bridged(to, amount);
    }
}
