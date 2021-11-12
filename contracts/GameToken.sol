// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";

contract GameToken is Context, AccessControlEnumerable, ERC20Pausable {
  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
  bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

  constructor() ERC20("jugoskandik", "JSD") {
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _setupRole(MINTER_ROLE, _msgSender());
    _setupRole(PAUSER_ROLE, _msgSender());
  }

  modifier minter() {
    require(hasRole(MINTER_ROLE, _msgSender()), "must have minter role to mint");
    _;
  }
  
  modifier pauser() {
    require(hasRole(PAUSER_ROLE, _msgSender()), "must have pauser role ");
    _;
  }

  /**

  */
  function mint(address to, uint256 amount) minter() public virtual {
    _mint(to, amount);
  }

  
  /**
    * @dev Pauses all token transfers.
    *
    * See {ERC20Pausable} and {Pausable-_pause}.
    *
    * Requirements:
    *
    * - the caller must have the `PAUSER_ROLE`.
    */
  function pause() public pauser() virtual {
    _pause();
  }

  /**
    * @dev Unpauses all token transfers.
    *
    * See {ERC20Pausable} and {Pausable-_unpause}.
    *
    * Requirements:
    *
    * - the caller must have the `PAUSER_ROLE`.
    */
  function unpause() public pauser() virtual {
    _unpause();
  }
}
