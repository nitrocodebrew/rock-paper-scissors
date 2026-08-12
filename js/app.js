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