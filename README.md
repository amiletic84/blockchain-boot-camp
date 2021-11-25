# blockchain-boot-camp
Rock Paper Scissor on ether.

## Project description
Implement simple Rock Paper Scissor game on blockchain.
Create smart contract that will host game logic with implemented commit/reveal pattern for submitting moves/choices. 
Winner of the game will be reworded with fungible game token, ERC20 mintable token.
Idea is to showcase scenario where series of applications can be created in one ecosystem
where participation in one game can reword player with tokens that can be used on some other part of application.

Use case where this minted token is used in other contract is not implemented but with ERC20 token that should not be a problem.


## Demo video
https://user-images.githubusercontent.com/90627773/143504633-63a0fb6d-072e-4093-b851-bb6d6993e93a.mp4



## How to run this project locally:

### Prerequisites

- Node.js >= v14
- Truffle and Ganache
- Yarn
- `git checkout master`

### running app - short version
- `npm install`
- `ganache-cli --networkId 1337`
- `truffle build`
- `truffle migrate --network develop`
- `cd client`
- `npm install`
- `yarn start`

### Contracts

- `npm install` in project root smart contract dependencies
- `truffle build` - build smart contract
- `truffle test` - run smart contract unit test
- `ganache-cli --networkId 1337` - run local network on port `8545`
- `truffle migrate --network develop` - deploy contracts on local netword
-  network id is 1337, use this id in Metamask


### Frontend

- `cd client`
- `yarn install`
- `yarn start`
- `http://localhost:3000` - open app in browser.

## Simple workflow

1. Enter game web site
2. Connect account with Metamask
3. Start new game
4. choose Rock, Paper, Scissors
5. Other player also connect and starts new game - from a different browser
6. Account of opponent is visible on screen
7. Both players commit there selected moves
8. Both players reveal moves
9. Game outcome is calculated and visible, if there is a winner it is reworded with 1000 JSD tokens.

## Directory structure

- `client`: Project's React frontend.
- `contracts`: Smart contracts that are deployed in the Ropsten testnet.
- `migrations`: Migration files for deploying contracts in `contracts` directory.
- `test`: Tests for smart contracts.
