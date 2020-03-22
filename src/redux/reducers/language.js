import {
  ADD_CONSTANT_NODE, ADD_UNARY_PREDICATE,
  IMPORT_APP, LOCK_CONSTANTS, LOCK_FUNCTIONS, LOCK_PREDICATES, REMOVE_CONSTANT_NODE, SET_CONSTANTS, SET_FUNCTIONS,
  SET_PREDICATES
} from "../actions/action_types";
import {RULE_CONSTANTS, RULE_DOMAIN, RULE_FUNCTIONS, RULE_PREDICATES} from "../../constants/parser_start_rules";
import {defaultInputData} from "../../constants";

let functions = require('./functions/functions');

let state = {};
let structure = null;

export function defaultState(){
  return{
    constants: defaultInputData(),
    predicates: defaultInputData(),
    functions: defaultInputData()
  }
}

function languageReducer(s, action, struct) {
  state = copyState(s);
  structure = struct;
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
      let predicateState = state.predicates.value;
      let unaryPredicate = action.predicateName+"/1";

      if(state.predicates.parsed){
        for(let i = 0;i<state.predicates.parsed.length;i++){
          if(state.predicates.parsed[i].name === action.predicateName){
            return state;
          }
        }
      }

      if(predicateState.charAt(predicateState.length-1)==="," || state.predicates.parsed === undefined || state.predicates.parsed.length===0){
        predicateState+=unaryPredicate;
      }
      else{
        predicateState+=","+unaryPredicate;
      }

      functions.parseText(predicateState, state.predicates, {startRule: RULE_PREDICATES});
      setPredicates();
      return state;
    case ADD_CONSTANT_NODE:
      let constantState = state.constants.value;

      if(constantState.charAt(constantState.length-1)==="," || state.constants.parsed === undefined || state.constants.parsed.length===0){
        constantState+=action.nodeName;
      }
      else{
        constantState=constantState+","+action.nodeName;
      }

      functions.parseText(constantState, state.constants, {startRule: RULE_CONSTANTS});
      setConstants();
      return state;

    case REMOVE_CONSTANT_NODE:
      let currentConstantState = state.constants.value;

      if(!state.constants.parsed || state.constants.parsed.length===1){
        currentConstantState = "";
      }

      else{
        let nodeRegex1 = new RegExp(action.nodeName+",","g");
        let nodeRegex2 = new RegExp(action.nodeName,"g");
        currentConstantState = currentConstantState.replace(nodeRegex1,"");
        currentConstantState = currentConstantState.replace(nodeRegex2,"");

        if(currentConstantState.charAt(currentConstantState.length-1)===","){
          currentConstantState = currentConstantState.substring(0,currentConstantState.length-1);
        }
      }

      functions.parseText(currentConstantState, state.constants, {startRule: RULE_DOMAIN});
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

function setConstants() {
  if (!state.constants.parsed) {
    return;
  }
  state.constants.errorMessage = structure.setLanguageConstants(state.constants.parsed);
}

function setPredicates() {
  if (!state.predicates.parsed) {
    return;
  }
  state.predicates.errorMessage = structure.setLanguagePredicates(state.predicates.parsed);
}

function setFunctions() {
  if (!state.functions.parsed) {
    return;
  }
  state.functions.errorMessage = structure.setLanguageFunctions(state.functions.parsed);
}

const copyState = (state) => ({
  ...state,
  constants: {...state.constants},
  predicates: {...state.predicates},
  functions: {...state.functions}
});

export default languageReducer;