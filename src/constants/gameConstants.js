export const PLAYER_QUANTIFIER = 'PLAYER_QUANTIFIER';
export const GAME_QUANTIFIER = 'GAME_QUANTIFIER';
export const PLAYER_OPERATOR = 'PLAYER_OPERATOR';
export const GAME_OPERATOR = 'GAME_OPERATOR';
export const NEGATION = 'NEGATION';
export const ATOM = 'ATOM';

export const defaultHintikkaGameData = () => ({
    gameHistory: new Array(),
    showVariables: false,
    gameEnabled: false,
    variableIndex: 1
});

export const gameEntry = (gameCommitment, gameVariables, gameValue, nextValue, gameMessages, userMessages) => ({
    gameCommitment: gameCommitment,
    gameValue: gameValue,
    nextValue: nextValue,
    gameVariables: gameVariables,
    gameMessages: gameMessages,
    userMessages: userMessages
})