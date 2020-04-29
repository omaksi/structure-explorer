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
  ADD_TERNARY_PREDICATE, REMOVE_TERNARY_PREDICATE, REMOVE_BINARY_FUNCTION
} from "../actions/action_types";
import {
  EMPTY_CONSTANT_VALUE, EMPTY_DOMAIN, FUNCTION_ALREADY_DEFINED, FUNCTION_NOT_FULL_DEFINED, ITEM_IN_LANGUAGE,
  ITEM_NOT_IN_DOMAIN
} from "../../constants/messages";
import {
  RULE_DOMAIN,
  RULE_PREDICATES_FUNCTIONS_VALUE,
  RULE_VARIABLE_VALUATION
} from "../../constants/parser_start_rules";
import {defaultInputData, PREDICATE} from "../../constants";
import {BOTH, FROM, PREDICATE as PRED,FUNCTION as FUNC, TO} from "../../graph_view/nodes/ConstantNames";

let functions = require('./functions/functions');

const constantDefaultInput = () => ({...defaultInputData(), errorMessage: EMPTY_CONSTANT_VALUE});
const predicateDefaultInput = () => ({...defaultInputData(), tableEnabled: false});
const functionDefaultInput = () => predicateDefaultInput();

let state = {};
let structure = null;

export function defaultState(){
  return{
    constants: {},
    predicates: {},
    functions: {},
    variables: {...defaultInputData(), object: new Map()},
    domain: {...defaultInputData(), errorMessage: EMPTY_DOMAIN}
  }
}

function structureReducer(s, action, struct) {
  state = copyState(s);
  structure = struct;
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
      structure.iConstant.set(action.newName, state.constants[action.newName]);
      syncLanguageWithStructure();
      return state;

    case ADD_UNARY_PREDICATE:
      addLanguageElement(action.predicateName, 1, [action.nodeName], PRED);
      return state;

    case ADD_BINARY_PREDICATE:
      addLanguageElement(action.predicateName, 2, [action.sourceNodeName, action.targetNodeName], PRED, BOTH);
      return state;

    case ADD_TERNARY_PREDICATE:
      addLanguageElement(action.predicateName,3,action.nodeName,PRED);
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

    case REMOVE_BINARY_FUNCTION:
      removeLanguageElement(action.predicateName,2,action.nodeName,FUNC);
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
      } else {
        removePredicateValue(action.predicateName, action.value);
      }
      let predicateValue = structure.getPredicateValue(action.predicateName);
      state.predicates[action.predicateName].parsed = predicateValue;
      state.predicates[action.predicateName].value = predicateValueToString(predicateValue);
      return state;
    case SET_FUNCTION_VALUE_TEXT:
      functions.parseText(action.value, state.functions[action.functionName], {startRule: RULE_PREDICATES_FUNCTIONS_VALUE});
      setFunctionValue(action.functionName);
      return state;
    case SET_FUNCTION_VALUE_TABLE:
      let tuple = action.value;
      let params = tuple.slice(0, tuple.length - 1);
      let value = tuple[tuple.length - 1];
      structure.changeFunctionValue(action.functionName, params, value);
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
      rebuildPredicatesValuesFromParsedInterpretation();

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

function addUnaryPredicate(predicateName,nodeName){
  let predName = predicateName+"/1";
  let newPredValue = "";

  if(structure.iPredicate.has(predName)){
    for(let parsedArrayOfLanguageElements of structure.iPredicate.get(predName)){
      newPredValue += parsedArrayOfLanguageElements[0]+", ";
    }
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

function addTupleLanguageElement(elementName,newValue,nodeNames,type){
  let elemName = elementName+"/2";
  let newElemValue = "";
  let structureInterpretationSet = type === PRED?structure.iPredicate:structure.iFunction;

  if(structureInterpretationSet.has(elemName)){
    for(let parsedArrayOfLanguageElements of structureInterpretationSet.get(elemName)){
      let joinedNodeNames = nodeNames.join(",");
      if(joinedNodeNames!==parsedArrayOfLanguageElements.join(",") && joinedNodeNames!==(parsedArrayOfLanguageElements[1]+","+parsedArrayOfLanguageElements[0])){
        newElemValue += "("+parsedArrayOfLanguageElements[0]+", "+parsedArrayOfLanguageElements[1]+"), ";
      }
    }
  }
  newElemValue += newValue;
  return newElemValue;
}

function buildNaryLanguageElement(elementName,arity,nodeNames,type){
  let elemName = elementName+"/"+arity;
  let newElemValue = "";
  let structureInterpretationSet = type === PRED?structure.iPredicate:structure.iFunction;

  if(structureInterpretationSet.has(elemName)){
    for(let parsedArrayOfLanguageElement of structureInterpretationSet.get(elemName)){
      let joinedParsedLanguageElement = parsedArrayOfLanguageElement.join(", ");
      if(joinedParsedLanguageElement!==nodeNames.join(", ")){
        newElemValue += "("+(joinedParsedLanguageElement)+"), ";
      }
    }
  }
  return newElemValue;
}

function buildPreviousFunctionValuesWithoutCurrentValue(elementName,nodeNames,direction=BOTH){
  let elemName = elementName + "/1";
  let newElemValue = "";

  if (structure.iFunction.has(elemName)) {
    let structureInterpretationObject = structure.iFunction.get(elemName);
    let joinedNodeNames = nodeNames.join(", ");

    for (let key in structureInterpretationObject) {
      if (structureInterpretationObject.hasOwnProperty(key)){
        //attention - whitespace
        let keyNodeNamesParsed = JSON.parse(key).join(", ")+(", "+structureInterpretationObject[key]);
        if(keyNodeNamesParsed!== joinedNodeNames){
          newElemValue+= addUnaryFuncValueBasedOnCondition(key,structureInterpretationObject,joinedNodeNames,direction)
        }
      }
    }
  }
  return newElemValue;
}

function addUnaryFuncValueBasedOnCondition(key,structureInterpretationObject,joinedNodeNames,direction){
  let parsedArray = JSON.parse(key);
  let keyNodeNamesParsed = parsedArray[0]+", "+structureInterpretationObject[key];

  if(keyNodeNamesParsed !== joinedNodeNames){
    if(direction === BOTH && (structureInterpretationObject[key]+", "+parsedArray[0]) === joinedNodeNames){
      return "";
    }
    else{
      return "("+keyNodeNamesParsed+"), ";
    }
  }
}

function addUnaryFunction(elementName,newValue,nodeNames) {
  return buildPreviousFunctionValuesWithoutCurrentValue(elementName,nodeNames)+newValue;
}

function removeUnaryFunction(elementName,nodeNames){
  let newElemValue = buildPreviousFunctionValuesWithoutCurrentValue(elementName,nodeNames,FROM);
  return newElemValue.substring(0,newElemValue.length-2);
}

function changePredicatesValues(oldNodeName,newNodeName) {
  for (let predKey of structure.iPredicate.keys()) {
    let predicateArity = parseInt(predKey.split("/")[1]);
    for(let nodeValue of structure.iPredicate.get(predKey)){
      for(let i = 0;i<predicateArity;i++){
        if(nodeValue[i] === oldNodeName){
          nodeValue[i] = newNodeName;
        }
      }
    }
  }
}

function rebuildPredicatesValuesFromParsedInterpretation() {
  for (let predKey of structure.iPredicate.keys()) {
    let predicateArity = parseInt(predKey.split("/")[1]);
    let newPredValue = "";
    for (let nodeValue of structure.iPredicate.get(predKey)) {
      if(predicateArity === 1){
        newPredValue+=nodeValue[0]+", ";
      }
      else{
        newPredValue+="(";
        for(let i = 0;i<predicateArity;i++){
          newPredValue+=nodeValue[i]+", ";
        }
        newPredValue = newPredValue.substring(0,newPredValue.length-2);
        newPredValue+="), ";
      }
    }
    newPredValue = newPredValue.substring(0,newPredValue.length-2);
    functions.parseText(newPredValue, state.predicates[predKey], {startRule: RULE_PREDICATES_FUNCTIONS_VALUE});
    setPredicateValue(predKey);
  }
}

function buildTupleValue(nodeNames,direction){
  if(direction === BOTH){
    if(nodeNames[0] === nodeNames[1]){
      return "("+nodeNames[0]+", "+nodeNames[1]+")";
    }
    else{
      return "("+nodeNames[0]+", "+nodeNames[1]+"),"+" ("+nodeNames[1]+", "+nodeNames[0]+")";
    }
  }
  else if(direction === FROM){
    return "("+nodeNames[0]+", "+nodeNames[1]+")";
  }
  else{
    return "("+nodeNames[1]+", "+nodeNames[0]+")";
  }
}

function addLanguageElement(elementName,elementArity,nodeNames,type,direction=""){
  let languageElementNameWithArity = elementName+"/"+elementArity;
  insertNewInputs();
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
    elementValue = addTupleLanguageElement(elementName,buildTupleValue(nodeNames,direction),nodeNames,PRED);
  }
  else{
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
    elementValue = buildNaryLanguageElement(elementName,elementArity,nodeNames,type);
    elementValue = elementValue.substring(0,elementValue.length-2);
  }

  console.log(elementValue);
  console.log(state.predicates);
  functions.parseText(elementValue,type===PRED?state.predicates[elementNameWithArity]:state.functions[elementNameWithArity],{startRule:RULE_PREDICATES_FUNCTIONS_VALUE});
  type===PRED?setPredicateValue(elementNameWithArity):setFunctionValue(elementNameWithArity);
}

function removeUnaryPredicate(predicateName,removeNodeName){
  let predName = predicateName+"/1";
  let newPredInterpretationValue = "";

  for(let nodeNameArray of structure.iPredicate.get(predName)){
    for(let currNodeName of nodeNameArray){
      if(currNodeName!==removeNodeName){
        newPredInterpretationValue+=currNodeName+", ";
      }
    }
  }
  return newPredInterpretationValue.substring(0,newPredInterpretationValue.length-2);
}

function removeBinaryPredicate(predicateName,sourceNode,targetNode){
  let predName = predicateName+"/2";
  let newPredInterpretationValue = "";

  for(let currentNodeNameTuple of structure.iPredicate.get(predName)){
    if(!(currentNodeNameTuple[0] === sourceNode && currentNodeNameTuple[1] === targetNode)){
      newPredInterpretationValue+="("+currentNodeNameTuple[0]+", "+currentNodeNameTuple[1]+"), ";
    }
  }
  return newPredInterpretationValue.substring(0,newPredInterpretationValue.length-2);
}

function setDomain() {
  if (!state.domain.parsed) {
    return;
  }
  state.domain.errorMessage = state.domain.parsed.length > 0 ? '' : EMPTY_DOMAIN;
  structure.setDomain(state.domain.parsed);
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

function syncLanguageWithStructure() {
  deleteUnusedInputs();
  insertNewInputs();
}

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
    if (structure.language.hasItem(variable)) {
      errorMessage = ITEM_IN_LANGUAGE(variable);
    }
    else if (!structure.hasDomainItem(value)) {
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
    structure.setConstantValue(constantName, value);
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
  structure.clearPredicateValue(predicateName);
  state.predicates[predicateName].errorMessage = '';
  state.predicates[predicateName].parsed.forEach(tuple => {
    addPredicateValue(predicateName, tuple);
  });
}

function addPredicateValue(predicateName, tuple) {
  try {
    structure.setPredicateValue(predicateName, tuple);
  } catch (e) {
    state.predicates[predicateName].errorMessage = e;
  }
}

function removePredicateValue(predicateName, tuple) {
  structure.removePredicateValue(predicateName, tuple);
}

function setFunctionValue(functionName) {
  if (!state.functions[functionName] || !state.functions[functionName].parsed) {
    return;
  }
  structure.clearFunctionValue(functionName);
  state.functions[functionName].errorMessage = '';
  let usedParams = [];
  state.functions[functionName].parsed.forEach(tuple => {
    try {
      let params = tuple.slice(0, tuple.length - 1);
      let stringifiedParams = JSON.stringify(params);
      let value = tuple[tuple.length - 1];
      if (usedParams.indexOf(stringifiedParams) > -1) {
        structure.removeFunctionValue(functionName, params);
        throw FUNCTION_ALREADY_DEFINED(params);
      } else {
        usedParams.push(stringifiedParams);
        structure.setFunctionValue(functionName, params, value);
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

function checkFunctionValue(functionName) {
  let arity = parseInt(functionName.split('/')[1]);
  if (structure.domain.size > 0) {
    if (!structure.iFunction.has(functionName) ||
       Object.keys(structure.iFunction.get(functionName)).length != structure.domainCombinations.get(arity).length) {
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