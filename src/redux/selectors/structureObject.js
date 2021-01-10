import { createSelector } from 'reselect'
import Structure from "../../model/Structure";
import {getLanguageObject} from "./languageObject";

const getConstants = state => state.structure.constants
const getFunctions = state => state.structure.functions
const getPredicates = state => state.structure.predicates
const getParsedDomain = state => state.structure.domain.parsed

export const getStructureObject = createSelector(
    [getLanguageObject, getConstants, getFunctions, getPredicates, getParsedDomain],
    (language, constants, functions, predicates, parsedDomain) => {
       return new Structure(language, parsedDomain, constants, predicates, functions);
    }
)

