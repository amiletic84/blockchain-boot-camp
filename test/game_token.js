let BN = web3.utils.BN;
const keccak256 = require('keccak256');
const minterRole = keccak256('MINTER_ROLE');
const pauserRole = keccak256('PAUSER_ROLE');

const GameToken = artifacts.require("GameToken");

const { catchRevert } = require("./helpers.js");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("GameToken", function (accounts) {
  let instance;
  const [owner, minter, pauser, alice, bob] = accounts;

  beforeEach(async () => {
    instance = await GameToken.deployed();
    await instance.grantRole(minterRole, minter, { from: owner });
    await instance.grantRole(pauserRole, pauser, { from: owner });

    const paused = await  instance.paused();
    if (paused) {
      await instance.unpause({ from: owner });
    }
  });

  it("owner has permissions to pause, unpause and mint tokens", async function () {
    await instance.pause({ from: owner });
    await instance.unpause({ from: owner });
    await instance.mint(bob, 2, { from: owner });
  });

  it("address with minter role should be able to mint tokens", async function () {
    const initialTotalSupply = await instance.totalSupply.call();

    const bobBalance = await instance.balanceOf(bob);

    await instance.mint(bob, 2, { from: minter });

    const totalSupply = await instance.totalSupply.call();
    const bobBalanceAfter = await instance.balanceOf(bob);

    assert.equal(
      new BN(totalSupply).toString(), 
      new BN(initialTotalSupply).add(new BN(2)).toString(), 
      "Total supply was not increased after mint.");
    
    assert.equal(
        new BN(bobBalanceAfter).toString(), 
        new BN(bobBalance).add(new BN(2)).toString(), 
        "Address balance was not increased after mint.");
  });

  it("should error when account does not have permission to mint tokens", async function () {
    await catchRevert(instance.mint(alice, 2, { from: bob }));
  })

  it("should error when account does not have permission to pause/unpause execution", async function () {
    await catchRevert(instance.pause({ from: bob }));
    await catchRevert(instance.unpause({ from: bob }));
  });

  it("when token is paused should throw error if minting", async function () {
    await instance.pause({ from: pauser });

    await catchRevert(instance.mint(bob, 2, { from: minter }));
  });

  it("when token is not paused it should mint tokens", async function () {
    await instance.pause({ from: pauser });

    await instance.unpause({ from: pauser });

    await instance.mint(bob, 2, { from: minter });
  });
});
