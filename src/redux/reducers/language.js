import {
  ADD_BINARY_PREDICATE,
  ADD_CONSTANT_NODE, ADD_TERNARY_PREDICATE, ADD_UNARY_FUNCTION,
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
      addLanguageElement(action.predicateName,1,PRED);
      return state;
    case ADD_BINARY_PREDICATE:
      addLanguageElement(action.predicateName,2,PRED);
      return state;
    case ADD_TERNARY_PREDICATE:
      addLanguageElement(action.predicateName,3,PRED);
      return state;
    case ADD_UNARY_FUNCTION:
      addLanguageElement(action.functionName,1,FUNC);
      return state;
    case ADD_CONSTANT_NODE:
      let newConstantVal = Array.from(structure.language.constants).join(", ");

      if(newConstantVal.length !== 0){
        newConstantVal+=", ";
      }
      newConstantVal+=action.nodeName;

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

      for(let constantName of structure.language.constants.keys()){
        if(constantName!==action.nodeName){
          newConstVal+=constantName+", ";
        }
      }
      newConstVal = newConstVal.substring(0,newConstVal.length-2);

      functions.parseText(newConstVal, state.constants, {startRule: RULE_CONSTANTS});
      setConstants();
      return state;

    case RENAME_CONSTANT_NODE:
      let newConsVal = "";

      for(let constantName of structure.language.constants.keys()){
        if(constantName===action.oldName){
          newConsVal+=action.newName+", ";
        }
        else{
          newConsVal+=constantName+", ";
        }
      }
      newConsVal = newConsVal.substring(0,newConsVal.length-2);

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
  return Array.from(structure.language.constants).join(", ");
}

function returnParsedPredValues(){
  let newPredValues = "";

  for(let [predicateName,predicateArity] of structure.language.predicates.entries()){
    newPredValues+=predicateName+"/"+predicateArity+", ";
  }
  newPredValues = newPredValues.substring(0,newPredValues.length-2);

  return newPredValues;
}

function returnParsedFuncValues(){
  let newFuncValues = "";

  for(let [functionName,functionArity] of structure.language.functions.entries()){
    newFuncValues+=functionName+"/"+functionArity+", ";
  }
  newFuncValues = newFuncValues.substring(0,newFuncValues.length-2);

  return newFuncValues;
}

function addLanguageElement(elementName,elementArity,type){
  let elementNameWithArity = elementName+"/"+elementArity;
  let parsedElementMap = type===PRED?structure.language.predicates:structure.language.functions;
  let newElemValue = "";

  for(let [elemValue,elemArity] of parsedElementMap.entries()){
    newElemValue+=elemValue+"/"+elemArity+", ";
  }

  if(newElemValue.length!==0){
    if(!parsedElementMap.has(elementName)) {
      newElemValue += elementNameWithArity;
    }
    else{
      newElemValue = newElemValue.substring(0,newElemValue.length-2);
    }
  }
  else{
    newElemValue = elementNameWithArity;
  }

  let elemState = type===PRED?state.predicates:state.functions;
  functions.parseText(newElemValue, elemState, {startRule: type===PRED?RULE_PREDICATES:RULE_FUNCTIONS});
  type===PRED?setPredicates():setFunctions();
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