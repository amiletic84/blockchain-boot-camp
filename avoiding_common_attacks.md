# Contract security measures

## SWC-100 (Function Default Visibility)
All functions have visibility operator set, no default operators.

## SWC-103 (Floating pragma)

Specific compiler pragma `0.8.0` used in contracts.

## SWC-105 (Unprotected Ether Withdrawal)

`withdraw` is protected with OpenZeppelin `Ownable`'s `onlyOwner` modifier.

## SWC-107 (Reentrancy)

Function reveal have external call to the GameToken.mint function. This function is called after all the internal state change is completed so reentrancy attack is not possible.
All internal state changes are performed before the call is executed.

## Use Modifiers Only for Validation

Modifiers contains only validation logic.
Modifier are used on all functions to enforce only valid calls to the contract with `require` statements.

## Pull over push

Only one function in RockPaperScissor is creating external call to the trusted contract address for minting token.

## SWC-115 (Tx.Origin Authentication)
msg.sender is used in all modifiers to validate transaction sender permissions and flow of the contract.

## SWC-119 (Shadowing State Variables)
all contract functions is checked to use proper names for variables

## SWC-125 (Incorrect Inheritance Order)
used rule of thumb when writing inheritance on GameToken and RockPaperScissors contracts, first more generic contracts are listed in inheritance list.