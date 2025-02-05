// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Bridge ERC20 vers Tezos
/// @notice Permet de déposer des tokens ERC20 en vue d’un transfert vers Tezos et de débloquer des tokens sur Ethereum après preuve cross-chain.
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

    /// @notice Constructeur qui initialise le token
    /// @param _token L'adresse du token ERC20 à verrouiller
    constructor(IERC20 _token) Ownable(msg.sender) {
        token = _token;
    }

    /// @notice Dépose (verrouille) des tokens ERC20 en vue d’un transfert vers Tezos
    /// @param amount Le montant de tokens à déposer (doit être approuvé au préalable par l'utilisateur)
    /// @param tezosRecipient L’adresse ou identifiant du destinataire sur Tezos (sous forme de chaîne)
    function deposit(uint256 amount, string calldata tezosRecipient) external {
        require(amount > 0, "Le montant doit etre superieur a 0");

        token.safeTransferFrom(msg.sender, address(this), amount);

        balances[msg.sender] += amount;

        emit Deposited(msg.sender, tezosRecipient, amount);
    }

    /// @notice Débloque des tokens ERC20 (en cas de retour depuis Tezos)
    /// @param to L'adresse destinataire sur Ethereum
    /// @param amount Le montant de tokens à débloquer
    /// @dev Cette fonction doit être appelée par le propriétaire (admin) une fois la preuve de burn sur Tezos vérifiée
    function withdraw(address to, uint256 amount) external onlyOwner {
        require(amount > 0, "Le montant doit etre superieur a 0");
        require(balances[to] >= amount, "Solde verrouille insuffisant pour l'adresse");

        balances[to] -= amount;

        // Transfert sécurisé des tokens vers l'adresse de destination
        token.safeTransfer(to, amount);

        emit Withdrawn(to, amount);
    }
}
