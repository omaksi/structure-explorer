import { createSelector } from 'reselect'
import Structure from "../../model/Structure";
import {getLanguageObject} from "./languageObject";

const getConstants = state => state.structure.constants
const getFunctions = state => state.structure.functions
const getPredicates = state => state.structure.predicates
const getParsedDomain = state => state.structure.domain.parsed
const getVariables = state => state.structure.variables.object

export const getStructureObject = createSelector(
    [getLanguageObject, getConstants, getFunctions, getPredicates, getParsedDomain, getVariables],
    (language, constants, functions, predicates, parsedDomain, variables) => {
       return new Structure(language, parsedDomain, constants, predicates, functions, variables);
    }
)

