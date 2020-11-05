import { createSelector } from 'reselect'
import Language from "../../math_view/model/Language";

const getConstants = state => state.language.constants
const getFunctions = state => state.language.functions
const getPredicates = state => state.language.predicates

export const getLanguageObject = createSelector(
    [getConstants, getFunctions, getPredicates],
    (constants, functions, predicates) => {
        return new Language(constants, functions, predicates);
    }
)

