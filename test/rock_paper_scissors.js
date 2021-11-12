let BN = web3.utils.BN;
const keccak256 = require('keccak256');
const pauserRole = keccak256('PAUSER_ROLE');
const RockPaperScissors = artifacts.require("RockPaperScissors");
const GameToken = artifacts.require("GameToken");

const { catchRevert } = require("./helpers.js");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("RockPaperScissors", function (accounts) {
  const [owner, player1, player2, pauser, otherPlayer ] = accounts;
  let tokenInstance;
  let gameInstance;
  let gameId;
  
  beforeEach(async () => {
    tokenInstance = await GameToken.deployed();
    gameInstance = await RockPaperScissors.deployed();
    await gameInstance.grantRole(pauserRole, pauser, { from: owner });
    const paused = await gameInstance.paused();
    if (paused) {
      await gameInstance.unpause({ from: owner });
    }

    // setup new game
    const player1Register = await gameInstance.register({from: player1});
    const player2Register = await gameInstance.register({from: player2});

    const player1Id = Number(player1Register.logs[0].args.gameId);
    const player2Id = Number(player2Register.logs[0].args.gameId);

    // game was already in progress
    // add player 1 in player2 game
    if (player2Id != player1Id) {
      await gameInstance.register({from: player1});
    }
    gameId = player2Id;
  });

  it("when registering players first two players should be registered in same game, third should open new game", async function () {
    const player1Tx = await gameInstance.register({from: player1});
    const player2Tx = await gameInstance.register({from: player2});
    const otherGameTx = await gameInstance.register({from: player1});

    assert.equal(
      player1Tx.logs[0].event.toString(), 
      "PlayerRegistered", 
      "PlayerRegistered log is not emited"
    );

    assert.equal(
      new BN(player1Tx.logs[0].args.gameId).toString(), 
      new BN(player2Tx.logs[0].args.gameId).toString(), 
      "Players did not receive same gameId."
    );
    assert.equal(
      new BN(otherGameTx.logs[0].args.gameId).toString(), 
      new BN(player1Tx.logs[0].args.gameId).add(new BN(1)).toString(), 
      "Next game should be incremented by 1."
    );
  });

  it("player 1 win with rock vs scissors and is rewarded with token", async () => {
    const balanceBegining = await tokenInstance.balanceOf(player1);
    const move1 = `1${web3.utils.randomHex(4)}`; // rock
    const move2 = `3${web3.utils.randomHex(4)}`; // scissors

    // commit
    commit1Tx = await gameInstance.commit(gameId, web3.utils.soliditySha3(move1), {from: player1});
    assert.equal(
      commit1Tx.logs[0].event.toString(), 
      "MoveCommited", 
      "MoveCommited log is not emited"
    );
    await gameInstance.commit(gameId, web3.utils.soliditySha3(move2), {from: player2});

    // reveal phase    
    await gameInstance.reveal(gameId, move1, {from: player1});
    const tx = await gameInstance.reveal(gameId, move2, {from: player2});

    // check result
    assert.equal(
      tx.logs[0].event.toString(), 
      "MoveRevealed", 
      "MoveRevealed log is not emited"
    );
    assert.equal(
      tx.logs[1].event.toString(), 
      "GamerWinner", 
      "Winner log is not emited"
    );
    
    assert.equal(
      tx.logs[1].args.player.toString(), 
      player1.toString(), 
      "Player 1 should be winner of this game"
    );

    const balanceAfter = await tokenInstance.balanceOf(player1);
    assert.equal(
      new BN(balanceAfter).toString(), 
      new BN(balanceBegining).add(new BN(1)).toString(), 
      "Player 1 address balance was not increased after winning the game.");
  })

  it("player 1 win with paper vs rock and is rewarded with token", async () => {
    const balanceBegining = await tokenInstance.balanceOf(player1);
    const move1 = `2${web3.utils.randomHex(4)}`; // paper
    const move2 = `1${web3.utils.randomHex(4)}`; // rock

    // commit
    await gameInstance.commit(gameId, web3.utils.soliditySha3(move1), {from: player1});
    await gameInstance.commit(gameId, web3.utils.soliditySha3(move2), {from: player2});

    // reveal phase    
    await gameInstance.reveal(gameId, move1, {from: player1});
    const tx = await gameInstance.reveal(gameId, move2, {from: player2});

    // check result
    assert.equal(
      tx.logs[1].args.player.toString(), 
      player1.toString(), 
      "Player 1 should be winner of this game"
    );

    const balanceAfter = await tokenInstance.balanceOf(player1);
    assert.equal(
      new BN(balanceAfter).toString(), 
      new BN(balanceBegining).add(new BN(1)).toString(), 
      "Player 1 address balance was not increased after winning the game.");
  })

  it("player 2 win with paper vs scissors and is rewarded with token", async () => {
    const balanceBegining = await tokenInstance.balanceOf(player2);
    const move1 = `2${web3.utils.randomHex(4)}`; // paper
    const move2 = `3${web3.utils.randomHex(4)}`; // scissors

    // commit
    await gameInstance.commit(gameId, web3.utils.soliditySha3(move1), {from: player1});
    await gameInstance.commit(gameId, web3.utils.soliditySha3(move2), {from: player2});

    // reveal phase    
    await gameInstance.reveal(gameId, move1, {from: player1});
    const tx = await gameInstance.reveal(gameId, move2, {from: player2});

    // check result
    assert.equal(
      tx.logs[1].event.toString(), 
      "GamerWinner", 
      "Winner log is not emited"
    );
    
    assert.equal(
      tx.logs[1].args.player.toString(), 
      player2.toString(), 
      "Player 2 should be winner of this game"
    );

    const balanceAfter = await tokenInstance.balanceOf(player2);
    assert.equal(
      new BN(balanceAfter).toString(), 
      new BN(balanceBegining).add(new BN(1)).toString(), 
      "Player 2 address balance was not increased after winning the game.");
  })
    
  it("both players submitted same move game is drawn no token was awarded", async () => {
    const balanceBegining = await tokenInstance.balanceOf(player1);
    const move1 = `1${web3.utils.randomHex(4)}`; // rock
    const move2 = `1${web3.utils.randomHex(4)}`; // rock

    // commit
    await gameInstance.commit(gameId, web3.utils.soliditySha3(move1), {from: player1});
    await gameInstance.commit(gameId, web3.utils.soliditySha3(move2), {from: player2});

    // reveal phase    
    const tx = await gameInstance.reveal(gameId, move1, {from: player1});
    const tx1 = await gameInstance.reveal(gameId, move2, {from: player2});

    // check result
    assert.equal(
      tx.logs[0].event.toString(), 
      "MoveRevealed", 
      "MoveRevealed log is not emited"
    );

    assert.equal(
      tx1.logs[0].event.toString(), 
      "MoveRevealed", 
      "MoveRevealed log is not emited"
    );
  
    assert.equal(
      tx1.logs[1].event.toString(), 
      "GameDrawn", 
      "GameDrawn log is not emited"
    );
    
    const balanceAfter = await tokenInstance.balanceOf(player1);
    assert.equal(
      new BN(balanceAfter).toString(), 
      new BN(balanceBegining).toString(), 
      "Player 1 address should be the same after drawn game.");
  })
      
  it("when paused cannot register, commit or reveal", async () => {
    const move1 = `1${web3.utils.randomHex(4)}`; // rock

    await gameInstance.pause({from: pauser});

    await catchRevert(gameInstance.register({from: player1}));
    await catchRevert(gameInstance.commit(gameId, web3.utils.soliditySha3(move1), {from: player1}));
    await catchRevert(gameInstance.reveal(gameId, move1, {from: player1}));
  });

  it("cannot reveal before commit both players does not commit moves", async () => {
    const move1 = `1${web3.utils.randomHex(4)}`; // rock
    await gameInstance.commit(gameId, web3.utils.soliditySha3(move1), {from: player1});
    await catchRevert(gameInstance.reveal(gameId, move1, {from: player1}));
  });

  it("cannot commit or reveal move if not registered on game", async () => {
    const move1 = `1${web3.utils.randomHex(4)}`; // rock
    const move2 = `1${web3.utils.randomHex(4)}`; // rock

    await catchRevert(gameInstance.commit(gameId, web3.utils.soliditySha3(move1), {from: otherPlayer}));

    // commit
    await gameInstance.commit(gameId, web3.utils.soliditySha3(move1), {from: player1});
    await gameInstance.commit(gameId, web3.utils.soliditySha3(move2), {from: player2});
    
    // reveal phase    
    await catchRevert(gameInstance.reveal(gameId, move2, {from: otherPlayer}));
  });

  
  it("when game is over and moves revealed cannot reveal more times", async () => {
    const move1 = `1${web3.utils.randomHex(4)}`; // rock
    const move2 = `1${web3.utils.randomHex(4)}`; // rock

    // commit
    await gameInstance.commit(gameId, web3.utils.soliditySha3(move1), {from: player1});
    await gameInstance.commit(gameId, web3.utils.soliditySha3(move2), {from: player2});

    await catchRevert(gameInstance.reveal(gameId, move1, {from: otherPlayer}));
  });


});
