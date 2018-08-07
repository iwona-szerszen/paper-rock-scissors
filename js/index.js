'use strict';

(function() {
  
  const message = document.getElementById('message');
  const result = document.getElementById('result');
  const output = document.getElementById('output');

  const buttonNewGame = document.getElementById('button-new-game');
  const buttonPaper = document.getElementById('button-paper');
  const buttonRock = document.getElementById('button-rock');
  const buttonScissors = document.getElementById('button-scissors');

  let winningRoundsLimit;
  let playerMovement;
  let playerWinners;
  let computerWinners;
  let isNextRoundPossible;

  /* longer function version of setting random computer movement 
  // drawing random number between 1 and 3
  function randomNumber() {
    return Math.floor(Math.random() * 3 + 1); // Math.floor(Math.random() * (max-min+1) + min)
  };

  // settig the value of computerMovement 
  function compMove(randomNumber) {
    switch (randomNumber) {
      case 1: {
        computerMovement = 'paper';
        break;
      }
      case 2: {
        computerMovement = 'rock';
        break;
      }
      case 3: {
        computerMovement = 'scissors';
        break;
      } 
    }
  };
  */

  function getRandomComputerMovement() {
    return ['paper', 'rock', 'scissors'][Math.floor(Math.random() * 3)];
  };
  
  // finding out who is the winner of single game part
  function getRoundWinner(playerMovement, computerMovement) {
    if ((playerMovement == 'paper' && computerMovement == 'rock') || 
        (playerMovement == 'rock' && computerMovement == 'scissors') || 
        (playerMovement == 'scissors' && computerMovement == 'paper')) {
      playerWinners++;
      return 'you';
    } else if ((playerMovement == 'paper' && computerMovement == 'scissors') || 
               (playerMovement == 'rock' && computerMovement == 'paper') || 
               (playerMovement == 'scissors' && computerMovement == 'rock')) {
      computerWinners++;
      return 'computer';
    } else {
      return 'nobody';
    }
  };

  // finding out who is the winner of entire game
  function getGameWinner(playerWinners, computerWinners) {
    return (playerWinners > computerWinners) ? 'YOU' : 'COMPUTER';
  };

  // printing result of single round
  function printSingleResult(winner, playerMovement, computerMovement) {
    output.insertAdjacentHTML('afterBegin', (winner.toUpperCase() + ' WON: you played ' + playerMovement.toUpperCase() + ', computer played ' + computerMovement.toUpperCase() + '.<br>'));
  };

  // printing results of all played rounds
  function printSummaryResults(playerWinners, computerWinners) {
    result.innerHTML = 'Summary results (Player - Computer) <strong>' + playerWinners + ' - ' + computerWinners + '</strong><br><br>';
  };
  
  function resetWinners() {
    playerWinners = 0;
    computerWinners = 0;
  }
  
  function initGame() {
    isNextRoundPossible = true;
    resetWinners();
    message.innerHTML = '<strong>' + winningRoundsLimit + '</strong> winning rounds finish your game - let\'s play!<br><br>Click on your movement:<br>';
  };
   
  function setGameEnding(winner) {
    isNextRoundPossible = false;
    resetWinners();
    output.insertAdjacentHTML('afterBegin', '<strong>The game has finished! '+ winner +' WON THE ENTIRE GAME!!!</strong><br>');
    message.innerHTML = '';
  };  
  
  function playerMove(text) {
    if (winningRoundsLimit === undefined || winningRoundsLimit === 'invalid') {
      output.insertAdjacentHTML('afterBegin', 'To start the game, please, press the new game button!<br>');
    } else {
      if (isNextRoundPossible) {
        playerMovement = text;
        printSingleResult(getRoundWinner(playerMovement, getRandomComputerMovement()), playerMovement, getRandomComputerMovement());
        printSummaryResults(playerWinners, computerWinners);
      } else {
        output.insertAdjacentHTML('afterBegin', 'Game over, please press the new game button!<br>');
      }
      if (playerWinners == winningRoundsLimit || computerWinners == winningRoundsLimit) {
        setGameEnding(getGameWinner(playerWinners, computerWinners));
      }    
    }
  };

  buttonNewGame.addEventListener('click', function() {
    result.innerHTML = '';
    output.innerHTML = '';
    winningRoundsLimit = (window.prompt('Enter the number of winning rounds that will finish the game:')).trim();
    // checking if entered data is an integer different from zero
    if ((Math.ceil(winningRoundsLimit) === Math.floor(winningRoundsLimit)) && winningRoundsLimit != 0) {
      initGame();
    } else {
      winningRoundsLimit = 'invalid';
      message.innerHTML = 'You\'ve entered incorrect number! Please, try again<br><br>';
    }  
  });

  buttonPaper.addEventListener('click', function() {
    playerMove('paper'); 
  });

  buttonRock.addEventListener('click', function() {
    playerMove('rock');
  });

  buttonScissors.addEventListener('click', function() {
    playerMove('scissors');
  });
  
})();