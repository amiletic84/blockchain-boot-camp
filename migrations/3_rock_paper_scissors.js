var RockPaperScissors = artifacts.require("./RockPaperScissors.sol");
var GameToken = artifacts.require("./GameToken.sol");
const keccak256 = require('keccak256');

module.exports = async function(deployer, network, accounts) {
  var minterRole = keccak256('MINTER_ROLE');

  const tokenInstance = await GameToken.deployed();
  const rockPaperScissorsInstance = await deployer.deploy(RockPaperScissors, tokenInstance.address);
  
  const owner = network === "develop" ? accounts[0] : process.env.OWNER_ID;
  await tokenInstance.grantRole(minterRole, rockPaperScissorsInstance.address, { from: owner });
};
