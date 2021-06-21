export const CONSTANT_IN_LANGUAGE = 'Jazyk už obsahuje konštantu';
export const FUNCTION_IN_LANGUAGE = 'Jazyk už obsahuje funkciu';
export const PREDICATE_IN_LANGUAGE = 'Jazyk už obsahuje predikát';

export const ITEM_IN_LANGUAGE = (item) => `Jazyk už obsahuje prvok ${item}`;

export const EMPTY_CONSTANT_VALUE = 'Interpretácia konštanty musí byť definovaná';
export const EMPTY_DOMAIN = 'Doména nesmie byť prázdna';
export const ITEM_NOT_IN_DOMAIN = (item) => `Doména neobsahuje prvok ${item}`;

export const FUNCTION_NOT_FULL_DEFINED = 'Funkcia nie je definovaná pre všetky argumenty';
export const FUNCTION_ALREADY_DEFINED = (params) => `Funkcia je viackrát definovaná pre argumenty ${params}`;
