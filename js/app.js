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
};

const initGame = () => {
    UI.controllers.forEach(btn => {
        btn.addEventListener('click', ({ currentTarget }) => {
            playMatch(currentTarget.dataset.playSelection);
        });
    });
};

initGame();