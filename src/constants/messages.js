
export const CONSTANT_IN_LANGUAGE = 'Jazyk štruktúry už obsahuje konštantu';
export const FUNCTION_IN_LANGUAGE = 'Jazyk štruktúry už obsahuje funkciu';
export const PREDICATE_IN_LANGUAGE = 'Jazyk štruktúry už obsahuje predikát';

export const ITEM_IN_LANGUAGE = (item) => `Jazyk už obsahuje prvok ${item}`;

export const EMPTY_CONSTANT_VALUE = 'Interpretačná hodnota konštanty nesmie byť prázdna';
export const EMPTY_DOMAIN = 'Množina domény nesmie byť prázdna';
export const ITEM_NOT_IN_DOMAIN = (item) => `Doména štruktúry neobsahuje prvok ${item}`;

export const FUNCTION_NOT_FULL_DEFINED = 'Funkcia nie je definovaná pre všetky argumenty';
export const FUNCTION_ALREADY_DEFINED = (params) => `Funkcia je viackrát definovaná pre argumenty ${params}`;

export const FIRST_QUESTION = (params) => `Aký máš začiatočný predpoklad o tejto formule: ${params} ?`;
export const ENTRY_SENTENCE = (formula, truth) => `Ak predpokladáš, že formula ${formula} je ${truth}.`;
export const EVALUATED_PREDICATE_IN = (formula, formulaName) => `${formula} ∈ i(${formulaName})`;
export const EVALUATED_PREDICATE_NOT_IN = (formula, formulaName) => `${formula} ∉ i(${formulaName})`;
export const EVALUATED_EQUALITY = (term1, term2) => `(${term1}) = (${term2})`;
export const EVALUATED_INEQUALITY = (term1, term2) => `(${term1}) ≠ (${term2})`;
