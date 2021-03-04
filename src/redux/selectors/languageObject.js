import { createSelector } from 'reselect'
import Language from "../../model/Language";

const getConstants = state => state.language.constants.parsed
const getFunctions = state => state.language.functions.parsed
const getPredicates = state => state.language.predicates.parsed

export const getLanguageObject = createSelector(
    [getConstants, getFunctions, getPredicates],
    (constants, functions, predicates) => {
        return new Language(constants, functions, predicates);
    }
)

