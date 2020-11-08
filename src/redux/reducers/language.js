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
} from "../../math_view/constants/parser_start_rules";
import {defaultInputData} from "../../math_view/constants";
import {PREDICATE as PRED,FUNCTION as FUNC} from "../../graph_view/nodes/ConstantNames";
import {
  validateConstants,
  validatePredicates,
  validateFunctions
} from "./functions/validation";

let functions = require('./functions/functions');

let state = {};

export function defaultState(){
  return{
    constants: defaultInputData(),
    predicates: defaultInputData(),
    functions: defaultInputData()
  }
}

function languageReducer(s, action) {
  state = copyState(s);
  switch (action.type) {
    case SET_CONSTANTS:
      functions.parseText(action.value, state.constants, {startRule: RULE_CONSTANTS});
      setConstants();
      setPredicates();
      setFunctions();
      return state;
    case SET_PREDICATES:
      functions.parseText(action.value, state.predicates, {startRule: RULE_PREDICATES});
      setPredicates();
      setConstants();
      setFunctions();
      return state;
    case SET_FUNCTIONS:
      functions.parseText(action.value, state.functions, {startRule: RULE_FUNCTIONS});
      setFunctions();
      setPredicates();
      setConstants();
      return state;
    case ADD_UNARY_PREDICATE:
      addLanguageElement(action.predicateName, 1, PRED);
      return state;
    case ADD_BINARY_PREDICATE:
      addLanguageElement(action.predicateName, 2, PRED);
      return state;
    case ADD_TERNARY_PREDICATE:
      addLanguageElement(action.predicateName, 3, PRED);
      return state;
    case ADD_QUATERNARY_PREDICATE:
      addLanguageElement(action.predicateName, 4, PRED);
      return state;
    case ADD_UNARY_FUNCTION:
      addLanguageElement(action.functionName, 1, FUNC);
      return state;
    case ADD_BINARY_FUNCTION:
      addLanguageElement(action.functionName, 2, FUNC);
      return state;
    case ADD_TERNARY_FUNCTION:
      addLanguageElement(action.functionName, 3, FUNC);
      return state;
    case ADD_CONSTANT_NODE:
      let newConstantVal = state.constants.value;

      if (newConstantVal.length !== 0) {
        newConstantVal += ", ";
      }
      newConstantVal += action.nodeName;

      functions.parseText(newConstantVal, state.constants, {startRule: RULE_CONSTANTS});
      setConstants();
      return state;

    case RENAME_DOMAIN_NODE:
    case REMOVE_DOMAIN_NODE:
      functions.parseText(returnParsedConstValues(), state.constants, {startRule: RULE_CONSTANTS});
      setConstants();

      functions.parseText(returnParsedPredValues(), state.predicates, {startRule: RULE_PREDICATES});
      setPredicates();

      functions.parseText(returnParsedFuncValues(), state.functions, {startRule: RULE_FUNCTIONS});
      setFunctions();

      return state;

    case REMOVE_CONSTANT_NODE:
      let newConstVal = "";
      let rm_constants = state.constants.value.split(", ");
      for (let constantName of rm_constants) {
        if (constantName !== action.nodeName) {
          newConstVal += constantName + ", ";
        }
      }
      newConstVal = newConstVal.substring(0, newConstVal.length - 2);

      functions.parseText(newConstVal, state.constants, {startRule: RULE_CONSTANTS});
      setConstants();
      return state;

    case RENAME_CONSTANT_NODE:
      let newConsVal = "";
      let rename_constants = state.constants.value.split(", ");
      for (let constantName of rename_constants) {
        if (constantName === action.oldName) {
          newConsVal += action.newName + ", ";
        } else {
          newConsVal += constantName + ", ";
        }
      }
      newConsVal = newConsVal.substring(0, newConsVal.length - 2);

      functions.parseText(newConsVal, state.constants, {startRule: RULE_CONSTANTS});
      setConstants();
      return state;

    case LOCK_CONSTANTS:
      state.constants.locked = !state.constants.locked;
      return state;
    case LOCK_PREDICATES:
      state.predicates.locked = !state.predicates.locked;
      return state;
    case LOCK_FUNCTIONS:
      state.functions.locked = !state.functions.locked;
      return state;
    case IMPORT_APP:
      setConstants();
      setPredicates();
      setFunctions();
      return state;
    default:
      return state;
  }
}

function returnParsedConstValues(){
  return state.constants.value;
}

function returnParsedPredValues(){
  return state.predicates.value;
}

function returnParsedFuncValues(){
  return state.functions.value;
}

function addLanguageElement(elementName,elementArity,type){
  let elementNameWithArity = elementName+"/"+elementArity;
  let newElemValue = type===PRED?state.predicates.value:state.functions.value;

  if(!newElemValue.includes(elementNameWithArity)) {
    if (newElemValue.length === 0) {
      newElemValue = elementNameWithArity;
    } else {
      newElemValue += ", " + elementNameWithArity;
    }
  }

  let elemState = type===PRED?state.predicates:state.functions;
  functions.parseText(newElemValue, elemState, {startRule: type===PRED?RULE_PREDICATES:RULE_FUNCTIONS});
  type===PRED?setPredicates():setFunctions();
}

function setConstants() {
  if (!state.constants.parsed) {
    return;
  }
  state.constants.errorMessage =
      validateConstants(state.constants.parsed, state.predicates.parsed, state.functions.parsed);
}

function setPredicates() {
  if (!state.predicates.parsed) {
    return;
  }
  state.predicates.errorMessage =
      validatePredicates(state.constants.parsed, state.predicates.parsed, state.functions.parsed);
}

function setFunctions() {
  if (!state.functions.parsed) {
    return;
  }
  state.functions.errorMessage =
      validateFunctions(state.constants.parsed, state.predicates.parsed, state.functions.parsed);
}

const copyState = (state) => ({
  ...state,
  constants: {...state.constants},
  predicates: {...state.predicates},
  functions: {...state.functions}
});

export default languageReducer;