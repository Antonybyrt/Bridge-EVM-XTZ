# Bridge-EVM-XTZ

## Overview
Bridge-EVM-XTZ is a blockchain bridge that facilitates asset transfers between Ethereum Virtual Machine (EVM)-compatible networks and Tezos (XTZ). This project enables interoperability between the two ecosystems, allowing users to transfer tokens seamlessly.

## Features
- Cross-chain asset transfers between EVM and Tezos networks
- Smart contract-based bridge mechanism
- Secure and efficient transaction handling
- Written in TypeScript and Solidity

## Prerequisites
Before running this project, ensure you have the following installed:
- Node.js (latest LTS version recommended)
- Yarn or npm
- Foundry (for Solidity development)
- Docker (optional, for running dependencies in containers)
- A configured Tezos and EVM-compatible wallet

## Installation
Clone the repository and install dependencies:

```sh
git clone <repository-url>
cd Bridge-EVM-XTZ
npm install ## or yarn install
```

## Configuration
Create a `.env` file in the root directory and specify the necessary environment variables:

```env
RPC_URL=<Your EVM RPC URL>
PRIVATE_KEY=<Your private key>
```

## Running the Project
### Deploy Smart Contracts
To deploy the bridge contracts on both EVM and Tezos networks:

```sh
forge script script/Bridge.s.sol:BridgeScript --rpc-url $ARB_SEPOLIA --private-key $PRIVATE_KEY --broadcast
```

### Start the Bridge Service
Run the bridge service to listen for cross-chain events:

```sh
npm start
```

## Testing
Run tests to ensure everything is working correctly:

```sh
npm test
```

## License
This project is licensed under the APGL-3.0 License. See the `LICENSE` file for details.

