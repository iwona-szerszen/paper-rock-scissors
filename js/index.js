'use strict';

(function() {
  
  const message = document.getElementById('message');
  const result = document.getElementById('result');
  const output = document.getElementById('output');
  const modalOverlay = document.getElementById('modal-overlay');

  const newGameButton = document.getElementById('button-new-game');
  const startButton = document.getElementById('button-start');
  const playerMoveButtons = document.getElementsByClassName('player-move');
  const closeButtons = document.querySelectorAll('.modal .close');
  const modals = document.getElementsByClassName('modal');
  const newGameModal = document.getElementById('modal-new-game');
  const gameEndingModal = document.getElementById('modal-game-ending');

  const params = {
    playerName: undefined,
    winningRoundsLimit: undefined,
    playerWinners: 0,
    computerWinners: 0,
    roundsPlayed: 0,
    isNextRoundPossible: false,
    progress: []
  };

  function getRandomComputerMovement() {
    return ['paper', 'rock', 'scissors'][Math.floor(Math.random() * 3)];
  }
  
  function getRoundWinner(playerName, playerMovement, computerMovement) {
    if ((playerMovement == 'paper' && computerMovement == 'rock') || 
        (playerMovement == 'rock' && computerMovement == 'scissors') || 
        (playerMovement == 'scissors' && computerMovement == 'paper')) {
      params.playerWinners++;
      return playerName;
    } else if ((playerMovement == 'paper' && computerMovement == 'scissors') || 
               (playerMovement == 'rock' && computerMovement == 'paper') || 
               (playerMovement == 'scissors' && computerMovement == 'rock')) {
      params.computerWinners++;
      return 'computer';
    } else {
      return 'nobody';
    }
  }
  
  function saveRoundData(self) {
    params.roundsPlayed++;
    params.progress[params.roundsPlayed - 1] = {};
    params.progress[params.roundsPlayed - 1] = {
      roundNumber: params.roundsPlayed, 
      playerMovement: self.getAttribute('data-move'),
      computerMovement: getRandomComputerMovement()
    };
  }

  function saveRoundResult() {
    params.progress[params.roundsPlayed - 1].roundWinner = getRoundWinner(params.playerName, params.progress[params.roundsPlayed - 1].playerMovement, params.progress[params.roundsPlayed - 1].computerMovement);
    params.progress[params.roundsPlayed - 1].actualResults = params.playerWinners + ' - ' + params.computerWinners;
  }

  function getGameWinner(playerName, playerWinners, computerWinners) {
    return (playerWinners > computerWinners) ? playerName : 'COMPUTER';
  }

  function printRoundWinner(roundWinner, playerName, playerMovement, computerMovement) {
    output.insertAdjacentHTML('afterBegin', `${roundWinner.toUpperCase()} WON: ${playerName} played ${playerMovement.toUpperCase()}, computer played ${computerMovement.toUpperCase()}.<br>`);
  }

  function printActualResults(playerName, actualResults) {
    result.innerHTML = `Actual results (${playerName} - Computer): <strong>${actualResults}</strong><br><br>`;
  }

  function initGame() {
    params.isNextRoundPossible = true;
    message.innerHTML = `<strong>${params.winningRoundsLimit}</strong> winning rounds finish your game - let\'s play!<br><br>Click on your movement:<br>`;
  }
   
  function setGameEnding() {
    params.isNextRoundPossible = false;
    params.playerWinners = 0;
    params.computerWinners = 0;
    deletePageInfo();    
  } 
  
  function play() {
    if (params.winningRoundsLimit === undefined || params.winningRoundsLimit === 'invalid') {
      output.insertAdjacentHTML('afterBegin', 'To start the game, please, press the new game button!<br>');
    } else {
      if (params.isNextRoundPossible) {     
        const self = this;   
        saveRoundData(self);
        saveRoundResult();
        printRoundWinner(params.progress[params.roundsPlayed - 1].roundWinner, params.playerName, params.progress[params.roundsPlayed - 1].playerMovement, params.progress[params.roundsPlayed - 1].computerMovement);
        printActualResults(params.playerName, params.progress[params.roundsPlayed - 1].actualResults);
      } else {
        output.insertAdjacentHTML('afterBegin', 'Game over, please press the new game button!<br>');
      }
      if (params.playerWinners == params.winningRoundsLimit || params.computerWinners == params.winningRoundsLimit) {
        showGameEndingModal(getGameWinner(params.playerName, params.playerWinners, params.computerWinners));
        setGameEnding();
      }    
    }
  }

  function showGameEndingModal(winner) {
    event.preventDefault();
    modalOverlay.classList.add('show');
    gameEndingModal.classList.add('show');
    newGameModal.classList.remove('show');
    gameEndingModal.getElementsByTagName('p')[0].innerHTML = `The game has finished! ${winner.toUpperCase()} WON THE ENTIRE GAME!`;
    for (let i = 0; i < params.progress.length; i++) {
      gameEndingModal.getElementsByTagName('tbody')[0].insertAdjacentHTML('afterBegin', `<tr><td>${params.progress[i].roundNumber}</td><td>${params.progress[i].playerMovement}</td><td>${params.progress[i].computerMovement}</td><td>${params.progress[i].roundWinner}</td><td>${params.progress[i].actualResults}</td></tr>`);
    }
  }

  function showNewGameModal() {
    event.preventDefault();
    modalOverlay.classList.add('show');
    newGameModal.classList.add('show');
    gameEndingModal.classList.remove('show');
  }

  function hideModal(event) {
    event.preventDefault();
    modalOverlay.classList.remove('show');
  }

  function clearNewGameModal() {
    document.getElementById('player-name').value = '';
    document.getElementById('winning-rounds-limit').value = '';
    newGameModal.getElementsByTagName('p')[0].innerHTML = '';
  }

  function clearGameEndingModal() {
    gameEndingModal.getElementsByTagName('p')[0].innerHTML = '';
    gameEndingModal.getElementsByTagName('tbody')[0].innerHTML = '';
  }

  function resetParams() {
    params.playerName = undefined;
    params.winningRoundsLimit = undefined;
    params.playerWinners = 0;
    params.computerWinners = 0;
    params.roundsPlayed = 0;
    params.isNextRoundPossible = false;
    params.progress = [];
  }

 function deletePageInfo() {
    message.innerHTML = '';
    result.innerHTML = '';
    output.innerHTML = '';
  }

  newGameButton.addEventListener('click', () => {
    deletePageInfo();
    resetParams();
    clearGameEndingModal();
    clearNewGameModal();
    showNewGameModal();
  });

  startButton.addEventListener('click', () => {
    params.playerName = document.getElementById('player-name').value.trim();
    params.winningRoundsLimit = document.getElementById('winning-rounds-limit').value;
    // checking if entered data is an integer different from zero
    if ((Math.ceil(params.winningRoundsLimit) === Math.floor(params.winningRoundsLimit)) && params.winningRoundsLimit >= 1 && params.playerName.length != 0) {
      hideModal(event);
      initGame();
    } else if(!params.playerName.length) {
      newGameModal.getElementsByTagName('p')[0].innerHTML = 'You\'ve entered no Player name! Please, try again';
    } else {
      params.winningRoundsLimit = 'invalid';
      document.getElementById('winning-rounds-limit').value = '';
      newGameModal.getElementsByTagName('p')[0].innerHTML = 'You\'ve entered incorrect number! Please, try again';
    }  
  });
  
  for (let i = 0; i < playerMoveButtons.length; i++) {
    playerMoveButtons[i].addEventListener('click', play);
  }

  for (let i = 0; i < closeButtons.length; i++) {
    closeButtons[i].addEventListener('click', hideModal);
  }
  
  modalOverlay.addEventListener('click', hideModal);

  for (let i = 0; i < modals.length; i++) {
    modals[i].addEventListener('click', event => {
      event.stopPropagation();
    });
  }  

})();