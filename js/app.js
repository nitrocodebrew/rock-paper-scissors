"use strict";

const $ = selector => document.querySelector(selector);

const UI = {
    matchCounter: $('.match-counter'),
    userScore: $('.user-score'),
    computerScore: $('.computer-score'),
    statusMessage: $('.status-message'),
    controllers: [
        $('.rock-btn'),
        $('.paper-btn'),
        $('.scissors-btn'),
    ],
};

const game = {
    match: 0,
    user: 0,
    computer: 0,
    matchHistory: [],
    selections: [
        'rock',
        'paper',
        'scissors',
    ],
    rules: {
        rock: 'scissors',
        paper: 'rock',
        scissors: 'paper',
    },
};

const createHtmlElement = (type, parentElement, attrsProps = {}) => {
    const htmlElement = document.createElement(type);

    for(const [key, value] of Object.entries(attrsProps)) {
        if(key in htmlElement) {
            htmlElement[key] = value;
        }
        else {
            htmlElement.setAttribute(key, value);
        }
    }

    return parentElement.appendChild(htmlElement);
};

const updateUI = (target, value) => {
    if(target in UI) {
        UI[target].textContent = value;
    }
};

const trackMatch = () => {
    game.match++;
    updateUI('matchCounter', game.match);
};

const trackUserScore = () => {
    game.user++;
    updateUI('userScore', game.user);
};

const trackComputerScore = () => {
    game.computer++;
    updateUI('computerScore', game.computer);
};

const updateStatusMessage = message => updateUI('statusMessage', message);

const renderMatchHistory = modalContent => {
    createHtmlElement('h4', modalContent, { textContent: 'Match History', });
    
    const matchHistoryList = createHtmlElement('ol', modalContent);
    const currentGame = game.matchHistory;

    let i = 0;
    while(i < currentGame.length) {
        const { userSelection, computerSelection, winner } = currentGame[i];
        
        const renderIcon = result => {
            switch(result) {
                case 'rock':
                    return '<i class="fa-solid fa-hand-fist"></i>';
                case 'paper':
                    return '<i class="fa-solid fa-hand"></i>';
                case 'scissors':
                    return '<i class="fa-solid fa-hand-scissors"></i>';
                case 'user':
                    return '<i class="fa-solid fa-award"></i>';
                case 'computer':
                    return '<i class="fa-solid fa-computer"></i>';
                default:
                    return '<i class="match-history-tied">&#8212;</i>';
            }
        };

        const historyResult = createHtmlElement('li', matchHistoryList);

        createHtmlElement(
            'span',
            historyResult,
            {
                innerHTML: `${renderIcon(userSelection)} vs ${renderIcon(computerSelection)}`,
            }
        );

        createHtmlElement(
            'span',
            historyResult,
            {
                innerHTML: `${renderIcon(winner)}`,
            }
        );
        i++;
    }
};

const resetGameStats = () => {
    game.match = 0;
    updateUI('matchCounter', game.match);

    game.user = 0;
    updateUI('userScore', game.user);

    game.computer = 0;
    updateUI('computerScore', game.computer);

    game.matchHistory = [];

    updateStatusMessage('Choose rock, paper, or scissors to get started!');
};

const endGame = () => {
    const modalWindow = createHtmlElement('dialog', $('body'), { id: 'modal', });
    const modalContent = createHtmlElement('div', modalWindow, { className: 'modal-content', });

    let winningResult;
    let userWon = false;

    if(game.user > game.computer) {
        winningResult = `Game over! You win the game ${game.user} - ${game.computer}.`;
        userWon = true;
    }
    else if(game.computer > game.user) {
        winningResult = `Game over! Computer won the game ${game.computer} - ${game.user}.`;
    }
    else {
        winningResult = 'Game over! It\'s a tie.';
    }

    createHtmlElement('h3', modalContent, { textContent: winningResult, });

    if(userWon) {
        createHtmlElement (
            'div', 
            modalContent, 
            { 
                innerHTML: '<i class="fa-solid fa-trophy"></i>',
                className: 'trophy-icon', 
            }
        );
    }

    renderMatchHistory(modalContent);
    
    const closeModal = createHtmlElement(
        'button',
        modalContent,
        {
            id: 'close-modal',
            type: 'button',
            innerHTML: 'Start New Game <i class="fa fa-gamepad"></i>',
        }
    );

    const exitModal = () => {
        modalWindow.close();
        modalWindow.remove();
    };

    closeModal.addEventListener('click', () => {
        exitModal();
        resetGameStats();
    });

    modalWindow.showModal();
};

const getComputerSelection = () => {
    const randomIndex = Math.floor(Math.random() * game.selections.length);
    return game.selections[randomIndex];
};

const compareSelections = (userSelection, computerSelection) => {
    // User won
    if(game.rules[userSelection] === computerSelection) {
        return {
            result: `You won the match with ${userSelection}!`,
            opponentSelection: `Computer chose ${computerSelection}.`,
            winner: `user`,
        };
    }

    // Match tied
    else if(userSelection === computerSelection) {
        return {
            result: `Tied!`,
            opponentSelection: `You both chose ${userSelection}.`,
            winner: null,
        };
    }

    // Computer won
    return {
        result: `Computer won the match with ${computerSelection}!`,
        opponentSelection: `You chose ${userSelection}.`,
        winner: 'computer',
    };
};

const getMatchResult = (userSelection, computerSelection) => {
    /**
     * Ensure only rock, paper, or scissors is selected... like any other HTML 
     * element, data-* attributes can be easily modified by the end-user.
     */
    if(!game.selections.includes(userSelection)) {
        return;
    }

    return compareSelections(userSelection, computerSelection);
};

const playMatch = userSelection => {
    const computerSelection = getComputerSelection();
    const { result, opponentSelection, winner } = getMatchResult(userSelection, computerSelection);

    trackMatch();

    if(winner === 'user') {
        trackUserScore();
    }
    else if(winner === 'computer') {
        trackComputerScore();
    }

    updateStatusMessage(`${result} ${opponentSelection}`);

    game.matchHistory.push({
        userSelection,
        computerSelection,
        winner,
    });

    if(game.match === 5) {
        setTimeout(endGame, 1000);
    }
};

const initGame = () => {
    UI.controllers.forEach(btn => {
        btn.addEventListener('click', ({ currentTarget }) => {
            playMatch(currentTarget.dataset.playSelection);
        });
    });
};

initGame();