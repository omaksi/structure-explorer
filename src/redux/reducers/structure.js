import {
  IMPORT_APP,
  LOCK_CONSTANT_VALUE,
  LOCK_DOMAIN,
  LOCK_FUNCTION_VALUE,
  LOCK_PREDICATE_VALUE,
  LOCK_VARIABLES,
  SET_CONSTANT_VALUE,
  SET_CONSTANTS,
  SET_DOMAIN,
  SET_FUNCTION_VALUE_TABLE,
  SET_FUNCTION_VALUE_TEXT,
  SET_FUNCTIONS,
  SET_PREDICATE_VALUE_TABLE,
  SET_PREDICATE_VALUE_TEXT,
  SET_PREDICATES,
  SET_VARIABLES_VALUE,
  TOGGLE_EDIT_TABLE,
  TOGGLE_EDIT_DATABASE,
  RENAME_DOMAIN_NODE,
  ADD_DOMAIN_NODE,
  REMOVE_DOMAIN_NODE,
  ADD_CONSTANT_NODE,
  REMOVE_CONSTANT_NODE,
  ADD_UNARY_PREDICATE,
  RENAME_CONSTANT_NODE,
  SET_CONSTANT_VALUE_FROM_LINK,
  REMOVE_UNARY_PREDICATE,
  ADD_BINARY_PREDICATE,
  REMOVE_BINARY_PREDICATE,
  CHANGE_DIRECTION_OF_BINARY_RELATION,
  ADD_UNARY_FUNCTION,
  REMOVE_UNARY_FUNCTION,
  ADD_TERNARY_PREDICATE,
  REMOVE_TERNARY_PREDICATE,
  REMOVE_BINARY_FUNCTION,
  ADD_QUATERNARY_PREDICATE,
  REMOVE_QUATERNARY_PREDICATE, REMOVE_TERNARY_FUNCTION, ADD_TERNARY_FUNCTION, ADD_BINARY_FUNCTION
} from "../actions/action_types";
import {
  EMPTY_CONSTANT_VALUE, EMPTY_DOMAIN, FUNCTION_ALREADY_DEFINED, FUNCTION_NOT_FULL_DEFINED, ITEM_IN_LANGUAGE,
  ITEM_NOT_IN_DOMAIN
} from "../../math_view/constants/messages";
import {
  RULE_DOMAIN,
  RULE_PREDICATES_FUNCTIONS_VALUE,
  RULE_VARIABLE_VALUATION
} from "../../math_view/constants/parser_start_rules";
import {defaultInputData, PREDICATE} from "../../math_view/constants";
import {BOTH, FROM, PREDICATE as PRED,FUNCTION as FUNC, TO} from "../../graph_view/nodes/ConstantNames";
import {
  validateStructureConstants,
  validateLanguagePredicates as validatePredicates,
  validateLanguageFunctions as validateFunctions
} from "./functions/validation";

let functions = require('./functions/functions');

const constantDefaultInput = () => ({...defaultInputData(), errorMessage: EMPTY_CONSTANT_VALUE});
const predicateDefaultInput = () => ({...defaultInputData(), tableEnabled: false});
const functionDefaultInput = () => predicateDefaultInput();

let state = {};

export function defaultState(){
  return{
    constants: {},
    predicates: {},
    functions: {},
    variables: {...defaultInputData(), object: new Map()},
    domain: {...defaultInputData(), errorMessage: EMPTY_DOMAIN}
  }
}

function structureReducer(s, action) {
  state = copyState(s);
  let input = action.itemType === PREDICATE ? state.predicates[action.name] : state.functions[action.name];
  switch (action.type) {
    case SET_CONSTANTS:
    case SET_PREDICATES:
    case SET_FUNCTIONS:
      syncLanguageWithStructure();
      setVariables();
      return state;

    case ADD_CONSTANT_NODE:
      insertNewInputs();
      return state;

    case REMOVE_CONSTANT_NODE:
      deleteUnusedInputs();
      return state;

    case SET_CONSTANT_VALUE_FROM_LINK:
      setConstantValue(action.constantNodeName, action.domainNodeName);
      return state;

    case RENAME_CONSTANT_NODE:
      let newStateConstantObject = Object.keys(state.constants).map(key => {
        let newKey = key === action.oldName ? action.newName : key;
        return {[newKey]: state.constants[key]}
      });

      state.constants = Object.assign({}, ...newStateConstantObject);
      syncLanguageWithStructure();
      return state;

    case ADD_UNARY_PREDICATE:
      addLanguageElement(action.predicateName, 1, [action.nodeName], PRED);
      return state;

    case ADD_BINARY_PREDICATE:
      addLanguageElement(action.predicateName, 2, [action.sourceNodeName, action.targetNodeName], PRED, action.direction);
      return state;

    case ADD_TERNARY_PREDICATE:
      addLanguageElement(action.predicateName,3,action.nodeName,PRED);
      return state;

    case ADD_QUATERNARY_PREDICATE:
      addLanguageElement(action.predicateName, 4,action.nodeName,PRED);
      return state;

    case ADD_BINARY_FUNCTION:
      addLanguageElement(action.functionName,2,action.nodeName,FUNC);
      return state;

    case ADD_TERNARY_FUNCTION:
      addLanguageElement(action.functionName,3,action.nodeName,FUNC);
      return state;

    case REMOVE_UNARY_PREDICATE:
      removeLanguageElement(action.predicateName, 1, [action.nodeName], PRED);
      return state;

    case REMOVE_BINARY_PREDICATE:
      removeLanguageElementInGivenDirection(action.predicateName, action.direction, action.sourceNodeName, action.targetNodeName, PRED);
      return state;

    case REMOVE_TERNARY_PREDICATE:
      removeLanguageElement(action.predicateName,3,action.nodeName,PRED);
      return state;

    case REMOVE_QUATERNARY_PREDICATE:
      removeLanguageElement(action.predicateName,4,action.nodeName,PRED);
      return state;

    case REMOVE_BINARY_FUNCTION:
      removeLanguageElement(action.functionName,2,action.nodeName,FUNC);
      return state;

    case REMOVE_TERNARY_FUNCTION:
      removeLanguageElement(action.functionName,3,action.nodeName,FUNC);
      return state;

    case CHANGE_DIRECTION_OF_BINARY_RELATION:
      let arity = action.langType === PRED?2:1;
      if (action.direction === FROM) {
        removeLanguageElement(action.languageElementName, arity, [action.targetNodeName, action.sourceNodeName], action.langType);
      } else if (action.direction === TO) {
        removeLanguageElement(action.languageElementName, arity, [action.sourceNodeName, action.targetNodeName], action.langType);
      }
      addLanguageElement(action.languageElementName, arity, [action.sourceNodeName, action.targetNodeName], action.langType, action.direction);
      return state;

    case ADD_UNARY_FUNCTION:
      addLanguageElement(action.functionName, 1, [action.sourceNodeName, action.targetNodeName], FUNC, action.direction);
      return state;

    case REMOVE_UNARY_FUNCTION:
      removeLanguageElementInGivenDirection(action.functionName, action.direction, action.sourceNodeName, action.targetNodeName, FUNC);
      return state;

    case SET_CONSTANT_VALUE:
      setConstantValue(action.constantName, action.value);
      return state;
    case SET_PREDICATE_VALUE_TEXT:
      functions.parseText(action.value, state.predicates[action.predicateName], {startRule: RULE_PREDICATES_FUNCTIONS_VALUE});
      setPredicateValue(action.predicateName);
      return state;
    case SET_PREDICATE_VALUE_TABLE:
      if (action.checked) {
        addPredicateValue(action.predicateName, action.value);
      }
      let newValue = action.value.slice(0, action.value.length - 1);
      let newValueString = newValue.length === 1 ? newValue.join(", ") : "(" + newValue.join(", ") + ")";
      let predicateValue = state.predicates[action.predicateName].value + "; " + newValueString;
      state.predicates[action.predicateName].value = predicateValue;
      functions.parseText(predicateValue, state.predicates[action.predicateName], {startRule: RULE_PREDICATES_FUNCTIONS_VALUE});
      return state;
    case SET_FUNCTION_VALUE_TEXT:
      functions.parseText(action.value, state.functions[action.functionName], {startRule: RULE_PREDICATES_FUNCTIONS_VALUE});
      setFunctionValue(action.functionName);
      return state;
    case SET_FUNCTION_VALUE_TABLE:
      let tuple = action.value;
      let params = tuple.slice(0, tuple.length - 1);
      let value = tuple[tuple.length - 1];
      //structure.changeFunctionValue(action.functionName, params, value);
      let fValue = structure.getFunctionValueArray(action.functionName);
      state.functions[action.functionName].parsed = fValue;
      state.functions[action.functionName].value = predicateValueToString(fValue);
      state.functions[action.functionName].errorMessage = '';
      if (!checkFunctionValue(action.functionName)) {
        state.functions[action.functionName].errorMessage = FUNCTION_NOT_FULL_DEFINED;
      }
      return state;
    case SET_VARIABLES_VALUE:
      functions.parseText(action.value, state.variables, {structure: structure, startRule: RULE_VARIABLE_VALUATION});
      setVariables();
      return state;

    case RENAME_DOMAIN_NODE:
      syncLanguageWithStructure();
      let newDomainVal = "";

      for (let nodeName of structure.domain) {
        if (nodeName === action.oldName) {
          newDomainVal += action.newName + ", ";
        } else {
          newDomainVal += nodeName + ", ";
        }
      }
      newDomainVal = newDomainVal.substring(0, newDomainVal.length - 2);

      functions.parseText(newDomainVal, state.domain, {startRule: RULE_DOMAIN});
      setDomain();

      Object.keys(state.constants).forEach(c => {
        if (state.constants[c].value === action.oldName) {
          state.constants[c].value = action.newName;
        }
      });
      setConstantsValues();

      changePredicatesValues(action.oldName, action.newName);

      /*setFunctionsValues();
      setVariables();*/
      return state;

    case ADD_DOMAIN_NODE:
      let domainState = Array.from(structure.domain).join(", ");

      if (domainState.length !== 0) {
        domainState += ", ";
      }
      domainState += action.nodeName;

      functions.parseText(domainState, state.domain, {startRule: RULE_DOMAIN});
      setDomain();
      return state;

    case REMOVE_DOMAIN_NODE:
      let newDomainValue = "";

      for (let domainElement of structure.domain.keys()) {
        if (domainElement !== action.nodeName) {
          newDomainValue += domainElement + ", ";
        }
      }
      newDomainValue = newDomainValue.substring(0, newDomainValue.length - 2);

      functions.parseText(newDomainValue, state.domain, {startRule: RULE_DOMAIN});
      setDomain();

      //toto mozem pretoze tu nie je input okno takze toto sa "neda" pokazit takym sposobom
      Object.keys(structure.domain).forEach(c => {
        if (state.constants[c].value === action.oldName) {
          state.constants[c].value = "";
        }
      });
      setConstantsValues();
      return state;

    case SET_DOMAIN:
      functions.parseText(action.value, state.domain, {startRule: RULE_DOMAIN});
      setDomain();
      setConstantsValues();
      setPredicatesValues();
      setFunctionsValues();
      setVariables();
      return state;

    case TOGGLE_EDIT_TABLE:
      if (input) {
        input.tableEnabled = !input.tableEnabled;
        if (input.tableEnabled) {
          input.databaseEnabled = false;
        }
      }
      return state;

    case TOGGLE_EDIT_DATABASE:
      if (input) {
        input.databaseEnabled = !input.databaseEnabled;
        if (input.databaseEnabled) {
          input.tableEnabled = false;
        }
      }
      return state;

    case LOCK_DOMAIN:
      state.domain.locked = !state.domain.locked;
      return state;
    case LOCK_CONSTANT_VALUE:
      state.constants[action.constantName].locked = !state.constants[action.constantName].locked;
      return state;
    case LOCK_PREDICATE_VALUE:
      state.predicates[action.predicateName].locked = !state.predicates[action.predicateName].locked;
      return state;
    case LOCK_FUNCTION_VALUE:
      state.functions[action.functionName].locked = !state.functions[action.functionName].locked;
      return state;
    case LOCK_VARIABLES:
      state.variables.locked = !state.variables.locked;
      return state;
    case IMPORT_APP:
      setDomain();
      setConstantsValues();
      setPredicatesValues();
      setFunctionsValues();
      setVariables();
      return state;
    default:
      return state;
  }
}

//Done
function addUnaryPredicate(predicateName,nodeName){
  let predName = predicateName+"/1";
  let newPredValue = "";

  if(state.predicates.includes(predName)){
      newPredValue += state.predicates[predName].value + "; ";
  }
  newPredValue += nodeName;
  return newPredValue;
}

function removeLanguageElementInGivenDirection(elementName,direction,sourceNodeName,targetNodeName,type) {
  let nodeNames = [sourceNodeName, targetNodeName]; //FROM direction

  if (direction === TO) {
    nodeNames = [targetNodeName,sourceNodeName];
  } else {
    removeLanguageElement(elementName, type===PRED?2:1, [targetNodeName, sourceNodeName], type); //deleting BOTH direction, starting with TO direction
  }
  removeLanguageElement(elementName, type===PRED?2:1, nodeNames, type);
}

//done
function addTupleLanguageElement(elementName,newValue){
  let elemName = elementName+"/2";
  let newElemValue = "";

  if(state.predicates.includes(elemName)){
    newElemValue += state.predicates[elemName].value;
    let newValues = newValue.split("; ");
    if(newValues.length === 2) {
      if (!state.predicates[elemName].value.includes(newValue[0])) {
        newElemValue += "; " + newValue[0];
      }
      if (!state.predicates[elemName].value.includes(newValue[1])) {
        newElemValue += "; " + newValue[1];
      }
    } else if(newValues.length === 1){
      if (!state.predicates[elemName].value.includes(newValue[0])) {
        newElemValue += "; " + newValue[0];
      }
    }
  } else {
    newElemValue += newValue;
  }
  return newElemValue;
}

//done
function buildNaryLanguageElement(elementName,arity,nodeNames,type){
  let elemName = elementName+"/"+arity;

  if(type === PRED){
    return buildNaryPredicateValue(elemName,nodeNames);
  }
 return buildNaryFunctionValue(elemName,nodeNames);
}

//DONE ? nechapem zmysel
function buildNaryPredicateValue(elemName,nodeNames){
  let newElemValue = "";
  if(state.predicates.includes(elemName)){
    let values = state.predicates[elemName].value.split("; ");
    let newValue = "(" + nodeNames.join(", ") + ")";
    for(let value of values){
      if(value !== newValue){
        newElemValue += value + "; ";
      }
    }
  }
  return newElemValue;
}

//Done
function buildNaryFunctionValue(elemName,nodeNames){
  let newElemValue = "";
  if(state.functions.includes(elemName)) {
    let values = state.functions[elemName].value.split("; ");
    let newValue = "(" + nodeNames.join(", ") + ")";
    for(let value of values) {
      if (value !== newValue) {
        newElemValue += value + "; ";
      }
    }
  }
  return newElemValue;
}

//Done
function addUnaryFunction(elementName,newValue,nodeNames) {
  let elemName = elementName + "/1";
  let newElemValue = "";

  if(state.functions.include(elemName)){
    let values = state.functions[elemName].split("; ");
    for(let value of values){
      let arg = value.split(",");
      //skips values with the same argument
      if(arg[0].substr(1) !== nodeNames[0]){
        newElemValue += value + "; ";
      }
    }

  }
  return newElemValue + newValue;
}

function removeUnaryFunction(elementName,nodeNames){
  let elemName = elementName + "/1";
  let newElemValue = "";

  if(state.functions.include(elemName)){
    let values = state.functions[elemName].split("; ");
    for(let value of values){
      let arg = value.split(",");
      //skips values with the same argument
      if(arg[0].substr(1) !== nodeNames[0]){
        newElemValue += value + "; ";
      }
    }

  }
  return newElemValue.substring(0,newElemValue.length-2);
}

function changePredicatesValues(oldNodeName,newNodeName) {
  for (let predKey of state.predicates) {
    let newValues = "";
    let predicateArity = parseInt(predKey.split("/")[1]);
    let values = state.predicates[predKey].value.split("; ");
    for(let value of values) {
      let nodeValues = value.split(", ");
      for (let i = 0; i < predicateArity; i++) {
        if (i === 0 && nodeValues[i].substring(1) === oldNodeName) {
          nodeValues[i] = predicateArity === 1 ? newNodeName : "(" + newNodeName;
        } else if (i === predicateArity - 1  && nodeValues[i].substring(0, nodeValues[i].length - 1) === oldNodeName) {
          nodeValues[i] = newNodeName + ")";
        } else if (nodeValues[i] === oldNodeName) {
          nodeValues[i] = newNodeName;
        }
      }
      newValues += nodeValues.join(", ") + "; ";
    }
    newValues = newValues.substr(0, newValues.length - 2);
    state.predicates[predKey].value = newValues;
    functions.parseText(newValues, state.predicates[predKey], {startRule: RULE_PREDICATES_FUNCTIONS_VALUE});
    setPredicateValue(predKey);
  }
}

//done
function buildTupleValue(nodeNames,direction){
  if(direction === BOTH){
    if(nodeNames[0] === nodeNames[1]){
      return "(" + nodeNames[0] + ", " + nodeNames[1] + ")";
    }
    else{
      return "(" + nodeNames[0] + ", " +nodeNames[1] + ");" + " (" + nodeNames[1] + ", " + nodeNames[0] + ")";
    }
  }
  else if(direction === FROM){
    return "(" + nodeNames[0] + ", " + nodeNames[1] + ")";
  }
  else{
    return "(" + nodeNames[1] + ", " + nodeNames[0] + ")";
  }
}

//done + nechapem
function addLanguageElement(elementName,elementArity,nodeNames,type,direction=""){
  let languageElementNameWithArity = elementName+"/"+elementArity;
  //insertNewInputs(); NECHAPEM
  let elementValue;

  if(elementArity === 1){
    if(type === PRED){
      elementValue = addUnaryPredicate(elementName,nodeNames[0]);
    }
    else{
      elementValue = addUnaryFunction(elementName,buildTupleValue(nodeNames,direction),nodeNames);
    }
  }
  else if(type === PRED && elementArity === 2){
    elementValue = addTupleLanguageElement(elementName,buildTupleValue(nodeNames,direction));
  }
  else{
    if(!nodeNames){
      return;
    }
    elementValue = buildNaryLanguageElement(elementName,elementArity,nodeNames,type);
    elementValue += "("+(nodeNames.join(", "))+")";
  }

  let elemState = type === PRED?state.predicates:state.functions;
  functions.parseText(elementValue, elemState[languageElementNameWithArity], {startRule: RULE_PREDICATES_FUNCTIONS_VALUE});
  type === PRED?setPredicateValue(languageElementNameWithArity):setFunctionValue(languageElementNameWithArity);
}

function removeLanguageElement(elementName,elementArity,nodeNames,type){
  let elementNameWithArity = elementName+"/"+elementArity;
  let elementValue;

  if(elementArity === 1){
    elementValue = type===PRED?removeUnaryPredicate(elementName,nodeNames[0]):removeUnaryFunction(elementName,nodeNames);
  }
  else if(type === PRED && elementArity === 2){
    elementValue = removeBinaryPredicate(elementName,nodeNames[0],nodeNames[1],PRED);
  }

  else{
    if(!nodeNames){
      return;
    }
    elementValue = buildNaryLanguageElement(elementName,elementArity,nodeNames,type);
    elementValue = elementValue.substring(0,elementValue.length-2);
  }

  functions.parseText(elementValue,type===PRED?state.predicates[elementNameWithArity]:state.functions[elementNameWithArity],{startRule:RULE_PREDICATES_FUNCTIONS_VALUE});
  type===PRED?setPredicateValue(elementNameWithArity):setFunctionValue(elementNameWithArity);
}

function removeUnaryPredicate(predicateName,removeNodeName){
  let predName = predicateName+"/1";
  let newPredInterpretationValue = "";
  let values = state.predicates[predName].value.split("; ");

  for(let value of values){
      if(value !== removeNodeName) {
        newPredInterpretationValue += value + "; ";
      }
  }
  return newPredInterpretationValue.substring(0,newPredInterpretationValue.length-2);
}

function removeBinaryPredicate(predicateName,sourceNode,targetNode){
  let predName = predicateName+"/2";
  let newPredInterpretationValue = "";

  let values = state.predicate[predName].split("; ");
  for(let value of values){
    if(!(value[0].substring(1) === sourceNode && value[1].substring(1, value[1].length - 1) === targetNode)){
      newPredInterpretationValue += value.join(", ") + "; ";
    }
  }
  return newPredInterpretationValue.substring(0,newPredInterpretationValue.length-2);
}

function setDomain() {
  if (!state.domain.parsed) {
    return;
  }
  state.domain.errorMessage = state.domain.parsed.length > 0 ? '' : EMPTY_DOMAIN;
}

function setConstantsValues() {
  Object.keys(state.constants).forEach(c => {
    setConstantValue(c, state.constants[c].value);
  })
}

function setPredicatesValues() {
  Object.keys(state.predicates).forEach(predicate => {
    setPredicateValue(predicate);
  })
}

function setFunctionsValues() {
  Object.keys(state.functions).forEach(f => {
    setFunctionValue(f);
  })
}

// ???
function syncLanguageWithStructure() {
  deleteUnusedInputs();
  insertNewInputs();
}

// ???
function deleteUnusedInputs() {
  Object.keys(state.constants).forEach(e => {
    if (!structure.language.hasConstant(e)) {
      delete state.constants[e];
    }
  });

  Object.keys(state.predicates).forEach(e => {
    if (!structure.language.hasPredicate(e)) {
      delete state.predicates[e];
    }
  });
  Object.keys(state.functions).forEach(e => {
    if (!structure.language.hasFunction(e)) {
      delete state.functions[e];
    }
  });
}

// ???
function insertNewInputs() {
  structure.language.getConstants().forEach(e => {
    if (!state.constants[e]) {
      state.constants[e] = constantDefaultInput();
    }
  });
  structure.language.predicates.forEach((arity, predicate) => {
    if (!state.predicates[predicate + '/' + arity]) {
      state.predicates[predicate + '/' + arity] = predicateDefaultInput()
    }
  });
  structure.language.functions.forEach((arity, func) => {
    if (!state.functions[func + '/' + arity]) {
      state.functions[func + '/' + arity] = functionDefaultInput();
    }
  });
}

//done
function setVariables() {
  if (!state.variables.parsed) {
    return;
  }
  if (!state.variables.object || !state.variables.object instanceof Map) {
    state.variables.object = new Map();
  } else {
    state.variables.object.clear();
  }
  let errorMessage = '';
  state.variables.parsed.forEach(tuple => {
    let variable = tuple[0];
    let value = tuple[1];
    let domainArray = state.domain.value.split(",");
    if (state.constants.includes(variable)
          || state.functions.includes(variable)
          || state.predicates.includes(variable)) {
      errorMessage = ITEM_IN_LANGUAGE(variable);
    }
    else if (!domainArray.includes(value)) {
      errorMessage = ITEM_NOT_IN_DOMAIN(value);
    }
    else {
      state.variables.object.set(variable, value);
    }
  });
  state.variables.errorMessage = errorMessage;
}

function setConstantValue(constantName, value) {
  try {
    validateStructureConstants(constantName, value, state.constants, state.domain.value.split(","));
    state.constants[constantName].value = value;
    state.constants[constantName].errorMessage = '';
  } catch (e) {
    console.error(e);
    state.constants[constantName].errorMessage = e;
    state.constants[constantName].value = '';
  }
}

function setPredicateValue(predicateName) {
  if (!state.predicates[predicateName] || !state.predicates[predicateName].parsed) {
    return;
  }
  state.predicates[predicateName].errorMessage = '';
}

function addPredicateValue(predicateName, tuple) {
  try {
    //structure.setPredicateValue(predicateName, tuple);
  } catch (e) {
    state.predicates[predicateName].errorMessage = e;
  }
}

//DONE ?
function setFunctionValue(functionName) {
  if (!state.functions[functionName] || !state.functions[functionName].parsed) {
    return;
  }
  state.functions[functionName].errorMessage = '';
  let usedParams = [];
  state.functions[functionName].parsed.forEach(tuple => {
    try {
      let params = tuple.slice(0, tuple.length - 1);
      let stringifiedParams = JSON.stringify(params);
      if (usedParams.indexOf(stringifiedParams) > -1) {
        throw FUNCTION_ALREADY_DEFINED(params);
      } else {
        usedParams.push(stringifiedParams);
      }
    } catch (e) {
      console.error(e);
      state.functions[functionName].errorMessage = e;
    }
  });
  let validValue = checkFunctionValue(functionName);
  if (!validValue) {
    if (state.functions[functionName].errorMessage.length === 0) {
      state.functions[functionName].errorMessage = FUNCTION_NOT_FULL_DEFINED;
    }
  } else {
    if (state.functions[functionName].errorMessage === FUNCTION_NOT_FULL_DEFINED) {
      state.functions[functionName].errorMessage = '';
    }
  }
}

//should work ?
function checkFunctionValue(functionName) {
  let arity = parseInt(functionName.split('/')[1]);
  let domainArray = state.domain.value.split(",");
  if (domainArray.length > 0) {
    if (!state.functions.includes(functionName) ||
       state.functions[functionName].value.split("; ").length != Math.pow(arity, domainArray.length)) {
      return false;
    }
  }
  return true;
}

const copyState = (state) => ({
  ...state,
  constants: {...state.constants},
  predicates: {...state.predicates},
  functions: {...state.functions},
  variables: {...state.variables},
  domain: {...state.domain},

});

function tupleToString(tuple) {
  if (tuple.length === 0)
    return '';
  if (tuple.length === 1)
    return tuple[0];
  let res = '(';
  for (let i = 0; i < tuple.length; i++) {
    res += tuple[i];
    if (i < tuple.length - 1)
      res += ', ';
  }
  res += ')';
  return res;
}

function predicateValueToString(value) {
  if (value === undefined || value.length === 0)
    return '';
  let res = '';
  for (let i = 0; i < value.length; i++) {
    res += tupleToString(value[i]);
    if (i < value.length - 1)
      res += ', ';
  }
  return res;
}

export default structureReducer;