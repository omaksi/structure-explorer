export const PLAYER_QUANTIFIER = 'PLAYER_QUANTIFIER';
export const GAME_QUANTIFIER = 'GAME_QUANTIFIER';
export const PLAYER_OPERATOR = 'PLAYER_OPERATOR';
export const GAME_OPERATOR = 'GAME_OPERATOR';
export const NEGATION = 'NEGATION';
export const ATOM = 'ATOM';

export const defaultHintikkaGameData = () => ({
    gameCommitment: null,
    gameHistory: [],
    gameVariables: new Map(),
    gameValue: null
});