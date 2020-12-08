import {
  ADD_BINARY_FUNCTION,
  ADD_BINARY_PREDICATE,
  ADD_CONSTANT_NODE, ADD_QUATERNARY_PREDICATE, ADD_TERNARY_FUNCTION, ADD_TERNARY_PREDICATE, ADD_UNARY_FUNCTION,
  ADD_UNARY_PREDICATE,
  IMPORT_APP,
  LOCK_CONSTANTS,
  LOCK_FUNCTIONS,
  LOCK_PREDICATES,
  REMOVE_CONSTANT_NODE, REMOVE_DOMAIN_NODE,
  RENAME_CONSTANT_NODE, RENAME_DOMAIN_NODE,
  SET_CONSTANTS,
  SET_FUNCTIONS,
  SET_PREDICATES
} from "../actions/action_types";
import {
  RULE_CONSTANTS,
  RULE_FUNCTIONS,
  RULE_PREDICATES
} from "../../constants/parser_start_rules";
import {defaultInputData} from "../../constants";
import {PREDICATE as PRED,FUNCTION as FUNC} from "../../graph_view/nodes/ConstantNames";
import {
  validateLanguageConstants as validateConstants,
  validateLanguagePredicates as validatePredicates,
  validateLanguageFunctions as validateFunctions
} from "./functions/validation";

let functions = require('./functions/functions');

export function defaultState(){
  return{
    constants: defaultInputData(),
    predicates: defaultInputData(),
    functions: defaultInputData()
  }
}

function languageReducer(oldState, action) {
  let newState = copyState(oldState);
  switch (action.type) {
    case SET_CONSTANTS:
      functions.parseText(action.value, newState.constants, {startRule: RULE_CONSTANTS});
      setConstants(newState);
      setPredicates(newState);
      setFunctions(newState);
      return newState;
    case SET_PREDICATES:
      functions.parseText(action.value, newState.predicates, {startRule: RULE_PREDICATES});
      setPredicates(newState);
      setConstants(newState);
      setFunctions(newState);
      return newState;
    case SET_FUNCTIONS:
      functions.parseText(action.value, newState.functions, {startRule: RULE_FUNCTIONS});
      setFunctions(newState);
      setPredicates(newState);
      setConstants(newState);
      return newState;
    case ADD_UNARY_PREDICATE:
      addPredicateLanguageElement(newState, action.predicateName, 1);
      return newState;
    case ADD_BINARY_PREDICATE:
      addPredicateLanguageElement(newState, action.predicateName, 2);
      return newState;
    case ADD_TERNARY_PREDICATE:
      addPredicateLanguageElement(newState, action.predicateName, 3);
      return newState;
    case ADD_QUATERNARY_PREDICATE:
      addPredicateLanguageElement(newState, action.predicateName, 4);
      return newState;
    case ADD_UNARY_FUNCTION:
      addFunctionLanguageElement(newState, action.functionName, 1);
      return newState;
    case ADD_BINARY_FUNCTION:
      addFunctionLanguageElement(newState, action.functionName, 2);
      return newState;
    case ADD_TERNARY_FUNCTION:
      addFunctionLanguageElement(newState, action.functionName, 3);
      return newState;
    case ADD_CONSTANT_NODE:
      newState.constants.parsed.push(action.nodeName);
      newState.constants.value = newState.constants.parsed.join(", ");
      setConstants(newState);
      return newState;

    case RENAME_DOMAIN_NODE:
    case REMOVE_DOMAIN_NODE:
      functions.parseText(returnParsedConstValues(newState), newState.constants, {startRule: RULE_CONSTANTS});
      setConstants(newState);

      functions.parseText(returnParsedPredValues(newState), newState.predicates, {startRule: RULE_PREDICATES});
      setPredicates(newState);

      functions.parseText(returnParsedFuncValues(newState), newState.functions, {startRule: RULE_FUNCTIONS});
      setFunctions(newState);

      return newState;

    case REMOVE_CONSTANT_NODE:
      newState.constants.parsed = newState.constants.parsed.filter(value => value != action.nodeName);
      newState.constants.value = newState.constants.parsed.join(", ");
      setConstants(newState);
      return newState;

    case RENAME_CONSTANT_NODE:
      newState.constants.parsed = newState.constants.parsed.map(value => value === action.oldName ? action.newName : value);
      newState.constants.value = newState.constants.parsed.join(", ");
      setConstants(newState);
      return newState;

    case LOCK_CONSTANTS:
      newState.constants.locked = !newState.constants.locked;
      return newState;
    case LOCK_PREDICATES:
      newState.predicates.locked = !newState.predicates.locked;
      return newState;
    case LOCK_FUNCTIONS:
      newState.functions.locked = !newState.functions.locked;
      return newState;
    case IMPORT_APP:
      setConstants(newState);
      setPredicates(newState);
      setFunctions(newState);
      return newState;
    default:
      return newState;
  }
}

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

function setConstants(state) {
  if (state.constants.parsed.length === 0 || state.constants.errorMessage !== '') {
    return;
  }
  state.constants.errorMessage =
      validateConstants(state.constants.parsed, state.functions.parsed, state.predicates.parsed);
}

function setPredicates(state) {
  if (state.predicates.parsed.length === 0 || state.predicates.errorMessage !== '') {
    return;
  }
  state.predicates.errorMessage =
      validatePredicates(state.constants.parsed, state.functions.parsed, state.predicates.parsed);
}

function setFunctions(state) {
  if (state.functions.parsed.length === 0 || state.predicates.errorMessage !== '') {
    return;
  }
  state.functions.errorMessage =
      validateFunctions(state.constants.parsed, state.functions.parsed, state.predicates.parsed);
}

const copyState = (state) => ({
  ...state,
  constants: {...state.constants},
  predicates: {...state.predicates},
  functions: {...state.functions}
});

export default languageReducer;