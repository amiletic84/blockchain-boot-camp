# Design patterns decisions

## Access Control Design Patterns

- `AccessControlEnumerable` contract is used on `GameToken` and `RockPaperScissors` contracts to implement role based access control. 
- Roles such as `MINTER_ROLE` and `PAUSER_ROLE` are defined on `GameToken`. 
- `MINTER_ROLE` - allow address with that role to create new tokens
- `PAUSER_ROLE` - allow contract execution to be stopped / paused.
- Owner of the contract has all roles and `DEFAULT_ADMIN_ROLE` that enables owner to grant or revoke roles to other addresses.
- `RockPaperScissors` contract has defined `PAUSER_ROLE` and `DEFAULT_ADMIN_ROLE`

## Inheritance and Interfaces

- `GameToken` contract inherits the OpenZeppelin `Context`, `AccessControlEnumerable`, `ERC20Pausable` contracts.
- `RockPaperScissors` contract inherits `AccessControlEnumerable`, `Pausable`

- `ERC20Pausable` - implementation of the ERC20 token with pausable option.
- `Pausable` - define modifiers that enable us to stop contract execution.
- `AccessControlEnumerable` - role based access control - implement functions and modifiers that allows creating roles, granting roles to address and checking if `sender` has role.
- `Context` - define `_msgSender` view function.

## Commit / Reveal pattern
- `RockPaperScissors` contract operates with commit/reveal pattern. Both players of the game first are registered.
- During the commit phase  players submit hashed (keccak256 used) selected move with seed 
- (first char of the string represent selected move Rock - 1, Paper - 2 or Scissors - 3 and some randome string appended). 
- When both players submit there selected moves, reveal phase starts. 
- Player send plain string, that string is validated that it match commited hash and game outcome is calculated.

## Inter-Contract Execution
- when game winner is determined `RockPaperScissors` calls mint function of the  `GameToken` contract and winner is reworded with 1000 `JSD` tokens.
