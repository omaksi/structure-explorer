import {
  ADD_BINARY_FUNCTION,
  ADD_BINARY_PREDICATE,
  ADD_CONSTANT_NODE, ADD_QUATERNARY_PREDICATE, ADD_TERNARY_FUNCTION, ADD_TERNARY_PREDICATE, ADD_UNARY_FUNCTION,
  ADD_UNARY_PREDICATE,
  IMPORT_APP,
  LOCK_CONSTANTS,
  LOCK_FUNCTIONS, LOCK_LANGUAGE_COMPONENT,
  LOCK_PREDICATES,
  REMOVE_CONSTANT_NODE, REMOVE_DOMAIN_NODE,
  RENAME_CONSTANT_NODE, RENAME_DOMAIN_NODE,
  SET_CONSTANTS,
  SET_FUNCTIONS,
  SET_PREDICATES
} from "../actions/action_types";
import {CONSTANT, defaultInputData, FUNCTION, PREDICATE} from "../../constants";
import {
  validateLanguageConstants as validateConstants,
  validateLanguagePredicates as validatePredicates,
  validateLanguageFunctions as validateFunctions
} from "./functions/validation";
import {parseLanguage} from "./functions/parsers";
import produce from "immer";

export function defaultState(){
  return{
    constants: defaultInputData(),
    predicates: defaultInputData(),
    functions: defaultInputData(),
    lockedComponent: false
  }
}

const languageReducer = produce((state, action) => {
  switch (action.type) {
    case SET_CONSTANTS:
      parseLanguage(state.constants, action.value, CONSTANT);
      setConstants(state);
      setPredicates(state, true);
      setFunctions(state, true);
      return;

    case SET_PREDICATES:
      parseLanguage(state.predicates, action.value, PREDICATE);
      setPredicates(state);
      setConstants(state, true);
      setFunctions(state, true);
      return;

    case SET_FUNCTIONS:
      parseLanguage(state.functions, action.value, FUNCTION);
      setFunctions(state);
      setPredicates(state, true);
      setConstants(state, true);
      return;

    case ADD_UNARY_PREDICATE:
      addPredicateLanguageElement(state, action.predicateName, 1);
      return;

    case ADD_BINARY_PREDICATE:
      addPredicateLanguageElement(state, action.predicateName, 2);
      return;

    case ADD_TERNARY_PREDICATE:
      addPredicateLanguageElement(state, action.predicateName, 3);
      return;

    case ADD_QUATERNARY_PREDICATE:
      addPredicateLanguageElement(state, action.predicateName, 4);
      return;

    case ADD_UNARY_FUNCTION:
      addFunctionLanguageElement(state, action.functionName, 1);
      return;

    case ADD_BINARY_FUNCTION:
      addFunctionLanguageElement(state, action.functionName, 2);
      return;

    case ADD_TERNARY_FUNCTION:
      addFunctionLanguageElement(state, action.functionName, 3);
      return;

    case ADD_CONSTANT_NODE:
      state.constants.parsed.push(action.nodeName);
      state.constants.value = state.constants.parsed.join(", ");
      setConstants(state);
      return;

    case RENAME_DOMAIN_NODE:
    case REMOVE_DOMAIN_NODE:
      parseLanguage(state.constants, returnParsedConstValues(state), CONSTANT);
      setConstants(state);

      parseLanguage(state.predicates, returnParsedPredValues(state), PREDICATE);
      setPredicates(state);

      parseLanguage(state.functions, returnParsedFuncValues(state), FUNCTION);
      setFunctions(state);

      return;

    case REMOVE_CONSTANT_NODE:
      state.constants.parsed = state.constants.parsed.filter(value => value != action.nodeName);
      state.constants.value = state.constants.parsed.join(", ");
      setConstants(state);
      return;

    case RENAME_CONSTANT_NODE:
      state.constants.parsed = state.constants.parsed.map(value => value === action.oldName ? action.newName : value);
      state.constants.value = state.constants.parsed.join(", ");
      setConstants(state);
      return;

    case LOCK_CONSTANTS:
      state.constants.locked = !state.constants.locked;
      return;

    case LOCK_PREDICATES:
      state.predicates.locked = !state.predicates.locked;
      return;

    case LOCK_FUNCTIONS:
      state.functions.locked = !state.functions.locked;
      return;

    case LOCK_LANGUAGE_COMPONENT:
      state.lockedComponent = !state.lockedComponent;
      return;

    case IMPORT_APP:
      setConstants(state);
      setPredicates(state);
      setFunctions(state);
      return;

    default:
      return;
  }
})

function returnParsedConstValues(state){
  return state.constants.parsed.join(", ");
}

function returnParsedPredValues(state){
  return state.predicates.parsed.map(value => value.name + "/" + value.arity).join(", ");
}

function returnParsedFuncValues(state){
  return state.functions.parsed.map(value => value.name + "/" + value.arity).join(", ");
}

function addPredicateLanguageElement(state, elementName, elementArity){
  state.predicates.parsed.push({name: elementName, arity: elementArity});
  state.predicates.value = state.predicates.parsed.map(value => value.name + "/" + value.arity).join(",");
  setPredicates(state);
}

function addFunctionLanguageElement(state, elementName, elementArity){
  state.functions.parsed.push({name: elementName, arity: elementArity});
  state.functions.value = state.functions.parsed.map(value => value.name + "/" + value.arity).join(",");
  setFunctions(state);
}

function setConstants(state, reParseValue = false) {
  if(reParseValue && !parseLanguage(state.constants, state.constants.value, CONSTANT)){
    return
  } else if (!reParseValue && state.constants.errorMessage !== '') {
    return;
  }
  state.constants.errorMessage =
      validateConstants(state.constants.parsed, state.functions.parsed, state.predicates.parsed);
}

function setPredicates(state, reParseValue = false) {
  if(reParseValue && !parseLanguage(state.predicates, state.predicates.value, PREDICATE)){
    return;
  } else if (!reParseValue && state.predicates.errorMessage !== '') {
    return;
  }
  state.predicates.errorMessage =
      validatePredicates(state.constants.parsed, state.functions.parsed, state.predicates.parsed);
}

function setFunctions(state, reParseValue = false) {
  if(reParseValue && !parseLanguage(state.functions, state.functions.value, FUNCTION)){
    return;
  } else if (!reParseValue && state.functions.errorMessage !== '') {
    return;
  }
  state.functions.errorMessage =
      validateFunctions(state.constants.parsed, state.functions.parsed, state.predicates.parsed);
}

export default languageReducer;