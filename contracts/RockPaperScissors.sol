// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "./GameToken.sol";

contract RockPaperScissors is AccessControlEnumerable, Pausable {
  bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

  /// @notice counter that keeps track of number of the games played
  /// @dev used to determine what next gameId should be
  uint public gameIdCount = 0;

  /// @dev token instance for minting
  GameToken private gameToken;
  
  /// @dev enum that defines allowed move in game with None as defaults
  enum Moves {None, Rock, Paper, Scissors}

  /// @dev struct that keeps submitted and revealed player move
  struct PlayerMove {
    bytes32 encrMove;
    Moves move;
    bool registered;
  }

  /// @dev struct that keep track of one game with players, moves and winner
  struct Game { 
    mapping(address => PlayerMove) playerMoves;
    address[] players;
    address winner;
    bool finished;
  }

  /// @notice mapping of games played
  /// @dev keeps list of games with players and submitted moves
  mapping(uint => Game) public games;

  /// @notice emited when player registers
  /// @dev emited when player registers
  /// @param player address of registered player
  /// @param gameId identifier of a game that player is registered to
  event PlayerRegistered(address player, uint gameId);

  /// @notice emited when player commits his move
  /// @dev emited when player commits his move
  /// @param player address of player that commited move
  /// @param gameId identifier of a game
  event MoveCommited(address player, uint gameId);

  /// @notice emited when player reveals his move
  /// @dev emited when player reveals his move
  /// @param player address of player that revealed move
  /// @param gameId identifier of a game
  event MoveRevealed(address player, uint gameId);

  /// @notice emited when game is drawn
  /// @dev emited when game is drawn
  /// @param gameId identifier of a game
  event GameDrawn(uint gameId);

  /// @notice emited when game winner is calculated
  /// @dev emited when game winner is calculated
  /// @param player address of player that won
  /// @param gameId identifier of a game
  event GamerWinner(address player, uint gameId);

  constructor(GameToken _gameToken) {
    gameToken = _gameToken;

    _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _setupRole(PAUSER_ROLE, msg.sender);
  }
  
  /// @notice Modifier that require Pauser role when user tries to pause/resume contract execution
  /// @dev Modifier used on pause/unpause functions
  modifier pauser() {
    require(hasRole(PAUSER_ROLE, _msgSender()), "must have pauser role");
    _;
  }

  /// @notice pause contact execution
  /// @dev this function will set pause to true in Pausable
  function pause() public pauser() virtual {
    _pause();
  }

  /// @notice resume contact execution
  /// @dev this function will set pause to false in Pausable
  function unpause() public pauser() virtual {
    _unpause();
  }
  /// @notice resume contact execution
  /// @dev modifier that checks if sender is registered that specific game instance
  modifier isRegistered(uint _gameId) {
    require (games[_gameId].playerMoves[msg.sender].registered, "Player is not registered");
    _;
  }
  
  /// @notice modifier function that checks wheter both users commited their moves
  /// @dev check encrMove is not default for both players 
  modifier whenMovesCommited(uint _gameId) {
    Game storage current = games[_gameId];
    require(current.playerMoves[current.players[0]].encrMove != 0x0 && 
      current.playerMoves[current.players[1]].encrMove != 0x0, "Both player must commit moves");
      _;
  }

  /// @notice Register user that wants to play the game.
  /// @dev register user / pair user to play with player that is waiting or create new game
  /// @return returns game id 
  function register() public whenNotPaused() returns(uint) {
    Game storage activeGame = games[gameIdCount];
    if (activeGame.players.length >= 2) { 
      // start new game
      gameIdCount = gameIdCount + 1;
      Game storage  newGame = games[gameIdCount];
      newGame.winner = address(0x0);
      newGame.finished = false;
    }
    
    Game storage currentGame = games[gameIdCount];
  
    currentGame.players.push(msg.sender);
    currentGame.playerMoves[msg.sender] = PlayerMove({
      move: Moves.None,
      registered: true,
      encrMove: 0x0
    });

    emit PlayerRegistered(msg.sender, gameIdCount);
    return gameIdCount;
  }

  /// @notice player commits move
  /// @dev Explain to a developer any extra details
  /// @param gameId game identifier
  /// @param encrMove encrypted move, first char in encrypted string should corresponds with Moves enum 
  /// @return if commit phase was successful.
  function commit(uint gameId, bytes32 encrMove) public whenNotPaused() isRegistered(gameId) returns (bool) {
    Game storage currentGame = games[gameId];
    if (currentGame.playerMoves[msg.sender].encrMove == 0x0) {
      currentGame.playerMoves[msg.sender].encrMove = encrMove;
      emit MoveCommited(msg.sender, gameId);
      return true;
    }
    return false;
  }

  /// @notice Reveal player move, if both player commited move than calculate 
  /// @dev Explain to a developer any extra details
  /// @param gameId game identifier
  /// @param plainMove plain string that was commited in commit phase.
  /// @return boolean whether action was successful
  function reveal(uint gameId, string memory plainMove) public whenNotPaused() isRegistered(gameId) whenMovesCommited(gameId) returns (bool) {
    Game storage currentGame = games[gameId];
    if (currentGame.finished) {
      // game is over
      return false;
    }
    
    bytes32 encrMove = keccak256(abi.encodePacked(plainMove));
    Moves move = getMove(plainMove);
    if (move == Moves.None) {
      return false;
    }

    if(currentGame.playerMoves[msg.sender].encrMove != encrMove) {
      return false;
    }

    currentGame.playerMoves[msg.sender].move = move;
    emit MoveRevealed(msg.sender, gameId);

    Moves movePlayer1 = currentGame.playerMoves[currentGame.players[0]].move;
    Moves movePlayer2 = currentGame.playerMoves[currentGame.players[1]].move;

    if (movePlayer1 != Moves.None && movePlayer2 != Moves.None) {
      currentGame.finished = true;
      if (movePlayer1 == movePlayer2) {
        // drawn game;
        emit GameDrawn(gameId);
        return true;
      }

      // game has winner
      if (isWinner(movePlayer1, movePlayer2)) {
        currentGame.winner = currentGame.players[0];
      } else {
        currentGame.winner = currentGame.players[1];
      }
      
      emit GamerWinner(currentGame.winner, gameId);

      // send transaction to mint token and mint token
      gameToken.mint(currentGame.winner, 1);
    }

    return true;
  }

  /// @notice get move from submitted string
  /// @dev first char should contain uint and is converted into enum Moves
  /// @param value plain string submitted in reveal phase
  /// @return Moves enum
  function getMove(string memory value) private pure returns (Moves) {
    uint moveValue = uint(uint8((bytes(value)[0])) - 48);
    if (moveValue > 3 || moveValue < 0) moveValue = 0;

    return Moves(moveValue);
  }

  /// @notice Check if first param move is winning move
  /// @dev it only checks cases when move1 is winning move, other returns false (even if it's drawn)
  /// @param move1 move submitted by one of the player
  /// @param move2 move submitted by other player
  /// @return true if is move1 is winning move
  function isWinner(Moves move1, Moves move2) private pure returns (bool) {
    if ((move1 == Moves.Rock && move2 == Moves.Scissors) || 
        (move1 == Moves.Scissors && move2 == Moves.Paper) ||
        (move1 == Moves.Paper && move2 == Moves.Rock)
    ) {
      return true;
    } 

    return false;
  }
}
