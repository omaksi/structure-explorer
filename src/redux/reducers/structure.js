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
  validateStructurePredicates,
  validateStructureFunctions
} from "./functions/validation";

let functions = require('./functions/functions');

const constantDefaultInput = () => ({...defaultInputData(), errorMessage: EMPTY_CONSTANT_VALUE});
const predicateDefaultInput = () => ({...defaultInputData(), tableEnabled: false});
const functionDefaultInput = () => predicateDefaultInput();


export function defaultState(){
  return{
    constants: {},
    predicates: {},
    functions: {},
    variables: {...defaultInputData(), object: new Map()},
    domain: {...defaultInputData(), errorMessage: EMPTY_DOMAIN}
  }
}

function structureReducer(state, action, language) {
  let newState = copyState(state);
  let input = action.itemType === PREDICATE ? newState.predicates[action.name] : newState.functions[action.name];
  switch (action.type) {
    case SET_CONSTANTS:
    case SET_PREDICATES:
    case SET_FUNCTIONS:
      syncLanguageWithStructure(newState, language);
      setVariables(newState, language);
      return newState;

    case ADD_CONSTANT_NODE:
      insertNewInputs(newState, language);
      return newState;

    case REMOVE_CONSTANT_NODE:
      deleteUnusedInputs(newState, language);
      return newState;

    case SET_CONSTANT_VALUE_FROM_LINK:
      setConstantValue(newState, action.constantNodeName, action.domainNodeName);
      return newState;

    case RENAME_CONSTANT_NODE:
      let newStateConstantObject = Object.keys(newState.constants).map(key => {
        let newKey = key === action.oldName ? action.newName : key;
        return {[newKey]: newState.constants[key]}
      });

      newState.constants = Object.assign({}, ...newStateConstantObject);
      syncLanguageWithStructure(newState, language);
      return newState;

    case ADD_UNARY_PREDICATE:
      addLanguageElement(newState, language, action.predicateName, 1, [action.nodeName], PRED);
      return newState;

    case ADD_BINARY_PREDICATE:
      addLanguageElement(newState, language, action.predicateName, 2, [action.sourceNodeName, action.targetNodeName], PRED, action.direction);
      return newState;

    case ADD_TERNARY_PREDICATE:
      addLanguageElement(newState, language, action.predicateName,3,action.nodeName,PRED);
      return newState;

    case ADD_QUATERNARY_PREDICATE:
      addLanguageElement(newState, language, action.predicateName, 4,action.nodeName,PRED);
      return newState;

    case ADD_BINARY_FUNCTION:
      addLanguageElement(newState, language, action.functionName,2,action.nodeName,FUNC);
      return newState;

    case ADD_TERNARY_FUNCTION:
      addLanguageElement(newState, language, action.functionName,3,action.nodeName,FUNC);
      return newState;

    case REMOVE_UNARY_PREDICATE:
      removeLanguageElement(newState, action.predicateName, 1, [action.nodeName], PRED);
      return newState;

    case REMOVE_BINARY_PREDICATE:
      removeLanguageElementInGivenDirection(action.predicateName, action.direction, action.sourceNodeName, action.targetNodeName, PRED);
      return newState;

    case REMOVE_TERNARY_PREDICATE:
      removeLanguageElement(newState, action.predicateName,3,action.nodeName,PRED);
      return newState;

    case REMOVE_QUATERNARY_PREDICATE:
      removeLanguageElement(newState, action.predicateName,4,action.nodeName,PRED);
      return newState;

    case REMOVE_BINARY_FUNCTION:
      removeLanguageElement(newState, action.functionName,2,action.nodeName,FUNC);
      return newState;

    case REMOVE_TERNARY_FUNCTION:
      removeLanguageElement(newState, action.functionName,3,action.nodeName,FUNC);
      return newState;

    case CHANGE_DIRECTION_OF_BINARY_RELATION:
      let arity = action.langType === PRED ? 2 : 1;
      if (action.direction === FROM) {
        removeLanguageElement(newState, action.languageElementName, arity, [action.targetNodeName, action.sourceNodeName], action.langType);
      } else if (action.direction === TO) {
        removeLanguageElement(newState, action.languageElementName, arity, [action.sourceNodeName, action.targetNodeName], action.langType);
      }
      addLanguageElement(newState, language, action.languageElementName, arity, [action.sourceNodeName, action.targetNodeName], action.langType, action.direction);
      return newState;

    case ADD_UNARY_FUNCTION:
      addLanguageElement(newState, language, action.functionName, 1, [action.sourceNodeName, action.targetNodeName], FUNC, action.direction);
      return newState;

    case REMOVE_UNARY_FUNCTION:
      removeLanguageElementInGivenDirection(newState, action.functionName, action.direction, action.sourceNodeName, action.targetNodeName, FUNC);
      return newState;

    case SET_CONSTANT_VALUE:
      setConstantValue(newState, action.constantName, action.value);
      return newState;
    case SET_PREDICATE_VALUE_TEXT:
      functions.parseText(action.value, newState.predicates[action.predicateName], {startRule: RULE_PREDICATES_FUNCTIONS_VALUE});
      checkPredicateValue(newState, action.predicateName);
      return newState;
    case SET_PREDICATE_VALUE_TABLE:
      let newValue = "";
      if (action.checked) {
        newValue = parsedToValue(newState.predicates[action.predicateName].parsed);
        if(newValue.length !== 0){
          newValue += ", ";
        }
        newValue += tupleToString(action.value);
      } else {
        newValue = parsedToValue(newState.predicates[action.predicateName].parsed.filter(tuple => !tuple.equals(action.value)));
      }
      //newState.predicates[action.predicateName].value = newValue;
      functions.parseText(newValue, newState.predicates[action.predicateName], {startRule: RULE_PREDICATES_FUNCTIONS_VALUE});
      checkPredicateValue(newState, action.predicateName);
      return newValue;
    case SET_FUNCTION_VALUE_TEXT:
      functions.parseText(action.value, newState.functions[action.functionName], {startRule: RULE_PREDICATES_FUNCTIONS_VALUE});
      checkFunctionValue(newState, action.functionName);
      return newState;
    case SET_FUNCTION_VALUE_TABLE:
      let params = action.value.slice(0, action.value.length - 1);
      let newParsedValue = newState.functions[action.functionName].parsed
          .map(tuple => tuple.slice(0, tuple.length - 1).equals(params) ? action.value : tuple);
      let value = parsedToValue(newParsedValue);
      functions.parseText(value, newState.predicates[action.predicateName], {startRule: RULE_PREDICATES_FUNCTIONS_VALUE});
      checkFunctionValue(newState, action.functionName);
      return newState;
    case SET_VARIABLES_VALUE:
      functions.parseText(action.value, newState.variables, {startRule: RULE_VARIABLE_VALUATION});
      setVariables(newState, language);
      return newState;
    case RENAME_DOMAIN_NODE:
      syncLanguageWithStructure(newState, language);
      let newDomainVal = newState.domain.parsed.map(value => value === action.oldName ? action.newName : value).join(", ");
      functions.parseText(newDomainVal, newState.domain, {startRule: RULE_DOMAIN});
      setDomain(newState);

      Object.keys(newState.constants).forEach(c => {
        if (newState.constants[c].value === action.oldName) {
          newState.constants[c].value = action.newName;
        }
      });
      setConstantsValues(newState);
      changePredicatesValues(newState, action.oldName, action.newName);
      return newState;

    case ADD_DOMAIN_NODE:
      let domainState = newState.domain.parsed.join(", ");

      if (domainState.length !== 0) {
        domainState += ", ";
      }
      domainState += action.nodeName;

      functions.parseText(domainState, newState.domain, {startRule: RULE_DOMAIN});
      setDomain(newState);
      return newState;

    case REMOVE_DOMAIN_NODE:
      let newDomainValue = newState.domain.parsed.filter(value => value !== action.nodeName).join(", ");
      functions.parseText(newDomainValue, newState.domain, {startRule: RULE_DOMAIN});
      setDomain(newState);

      //toto mozem pretoze tu nie je input okno takze toto sa "neda" pokazit takym sposobom
      newState.domain.parsed.forEach(c => {
        if (newState.constants[c].value === action.oldName) {
          newState.constants[c].value = "";
        }
      });
      setConstantsValues(newState);
      return newState;

    case SET_DOMAIN:
      functions.parseText(action.value, newState.domain, {startRule: RULE_DOMAIN});
      setDomain(newState);
      setConstantsValues(newState);
      setPredicatesValues(newState);
      setFunctionsValues(newState);
      setVariables(newState, language);
      return newState;

    case TOGGLE_EDIT_TABLE:
      if (input) {
        input.tableEnabled = !input.tableEnabled;
        if (input.tableEnabled) {
          input.databaseEnabled = false;
        }
      }
      return newState;

    case TOGGLE_EDIT_DATABASE:
      if (input) {
        input.databaseEnabled = !input.databaseEnabled;
        if (input.databaseEnabled) {
          input.tableEnabled = false;
        }
      }
      return newState;

    case LOCK_DOMAIN:
      newState.domain.locked = !newState.domain.locked;
      return newState;
    case LOCK_CONSTANT_VALUE:
      newState.constants[action.constantName].locked = !newState.constants[action.constantName].locked;
      return newState;
    case LOCK_PREDICATE_VALUE:
      newState.predicates[action.predicateName].locked = !newState.predicates[action.predicateName].locked;
      return newState;
    case LOCK_FUNCTION_VALUE:
      newState.functions[action.functionName].locked = !newState.functions[action.functionName].locked;
      return newState;
    case LOCK_VARIABLES:
      newState.variables.locked = !newState.variables.locked;
      return newState;
    case IMPORT_APP:
      setDomain(newState);
      setConstantsValues(newState);
      setPredicatesValues(newState);
      setFunctionsValues(newState);
      setVariables(newState, language);
      return newState;
    default:
      return newState;
  }
}

function removeLanguageElementInGivenDirection(state, elementName, direction, sourceNodeName, targetNodeName, type) {
  let nodeNames = [sourceNodeName, targetNodeName]; //FROM direction

  if (direction === TO) {
    nodeNames = [targetNodeName,sourceNodeName];
  } else {
    removeLanguageElement(state, elementName, type === PRED ? 2 : 1, [targetNodeName, sourceNodeName], type); //deleting BOTH direction, starting with TO direction
  }
  removeLanguageElement(state, elementName, type === PRED ? 2 : 1, nodeNames, type);
}

function changePredicatesValues(state, oldNodeName, newNodeName) {
  state.predicates.forEach(predicate => {
      let newParsedValues = state.predicates[predicate].parsed
          .map(tuple => tuple.map(value => value === oldNodeName ? newNodeName : value));
      let newValue = parsedToValue(newParsedValues);
      functions.parseText(newValue, state.predicates[predicate], {startRule: RULE_PREDICATES_FUNCTIONS_VALUE});
      checkPredicateValue(predicate);
  });
}

function buildTupleValue(nodeNames,direction){
  if(direction === BOTH){
    if(nodeNames[0] === nodeNames[1]){
      return "(" + nodeNames[0] + ", " + nodeNames[1] + ")";
    }
    else{
      return "(" + nodeNames[0] + ", " +nodeNames[1] + ")," + " (" + nodeNames[1] + ", " + nodeNames[0] + ")";
    }
  }
  else if(direction === FROM){
    return "(" + nodeNames[0] + ", " + nodeNames[1] + ")";
  }
  else{
    return "(" + nodeNames[1] + ", " + nodeNames[0] + ")";
  }
}

function addLanguageElement(state, language, elementName, elementArity, nodeNames, type, direction=""){
  let elementNameWithArity = elementName + "/" + elementArity;
  insertNewInputs(state, language);
  let elementValue = "";
  if(type === PRED){
    elementValue = parsedToValue(state.predicates[elementNameWithArity].parsed);
  } else {
    elementValue = parsedToValue(state.functions[elementNameWithArity].parsed);
  }
  if(elementValue.length !== 0){
    elementValue += ", ";
  }
  elementValue += elementArity === 2 ? buildTupleValue(nodeNames, direction) : tupleToString(nodeNames);

  let elemState = type === PRED ? state.predicates : state.functions;
  functions.parseText(elementValue, elemState[elementNameWithArity], {startRule: RULE_PREDICATES_FUNCTIONS_VALUE});
  type === PRED
      ? checkPredicateValue(state, elementNameWithArity)
      : checkFunctionValue(state, elementNameWithArity);
}

function removeLanguageElement(state, elementName,elementArity,nodeNames,type){
  let elementNameWithArity = elementName+"/"+elementArity;
  let elementValue = "";

  if(type === PRED){
    elementValue =
        parsedToValue(state.predicates[elementNameWithArity].parsed.filter(tuple => !tuple.equals(nodeNames)));
  } else {
    elementValue =
        parsedToValue(state.functions[elementNameWithArity].parsed.filter(tuple => !tuple.equals(nodeNames)));
  }
  let elemState = type === PRED ? state.predicates : state.functions;
  functions.parseText(elementValue, elemState[elementNameWithArity],{startRule:RULE_PREDICATES_FUNCTIONS_VALUE});
  type === PRED
      ? checkPredicateValue(state, elementNameWithArity)
      : checkFunctionValue(state, elementNameWithArity);
}

function setDomain(state) {
  if (!state.domain.parsed) {
    return;
  }
  state.domain.errorMessage = state.domain.parsed.length > 0 ? '' : EMPTY_DOMAIN;
}

function setConstantsValues(state) {
  Object.keys(state.constants).forEach(c => {
    setConstantValue(state, c, state.constants[c].value);
  })
}

function setPredicatesValues(state) {
  Object.keys(state.predicates).forEach(predicate => {
    checkPredicateValue(state, predicate);
  })
}

function setFunctionsValues(state) {
  Object.keys(state.functions).forEach(f => {
    checkFunctionValue(f);
  })
}

function syncLanguageWithStructure(state, language) {
  deleteUnusedInputs(state, language);
  insertNewInputs(state, language);
}

function deleteUnusedInputs(state, language) {
  Object.keys(state.constants).forEach(constantName => {
    if (!language.constants.parsed.some(c => c === constantName)) {
      delete state.constants[constantName];
    }
  });

  Object.keys(state.predicates).forEach(predicateName => {
    if (!language.predicates.parsed.some(p => (p.name + "/" + p.arity) === predicateName)) {
      delete state.predicates[predicateName];
    }
  });
  Object.keys(state.functions).forEach(functionName => {
    if (!language.functions.parsed.some(f => (f.name + "/" + f.arity) === functionName)) {
      delete state.functions[functionName];
    }
  });
}

function insertNewInputs(state, language) {
  language.constants.parsed.forEach(c => {
    if (!state.constants[c]) {
      state.constants[c] = constantDefaultInput();
    }
  });
  language.predicates.parsed.forEach(p => {
    let predicateName = p.name + "/" + p.arity;
    if (!state.predicates[predicateName]) {
      state.predicates[predicateName] = predicateDefaultInput()
    }
  });
  language.functions.parsed.forEach(f => {
    let functionName = f.name + "/" + f.arity;
    if (!state.functions[functionName]) {
      state.functions[functionName] = functionDefaultInput()
    }
  });
}

function setVariables(state, language) {
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
    if (language.constants.parsed.some(c => c === variable)
          || language.functions.parsed.some(f => (f.name + "/" + f.arity) === variable)
          || language.predicates.parsed.some(p => (p.name + "/" + p.arity) === variable)) {
      errorMessage = ITEM_IN_LANGUAGE(variable);
    }
    else if (!state.domain.parsed.some(d => d === value)) {
      errorMessage = ITEM_NOT_IN_DOMAIN(value);
    }
    else {
      state.variables.object.set(variable, value);
    }
  });
  state.variables.errorMessage = errorMessage;
}

function setConstantValue(state, constantName, value) {
  try {
    validateStructureConstants(constantName, value, state.constants, state.domain.parsed);
    state.constants[constantName].value = value;
    state.constants[constantName].errorMessage = '';
  } catch (e) {
    console.error(e);
    state.constants[constantName].errorMessage = e;
    state.constants[constantName].value = '';
  }
}

function checkPredicateValue(state, predicateName) {
  if (!state.predicates[predicateName] || !state.predicates[predicateName].parsed) {
    return;
  }
  let arity = predicateName.split("/")[1];
  state.predicates[predicateName].errorMessage =
      validateStructurePredicates(state.predicates[predicateName].parsed, state.domain.parsed, arity);
}

function checkFunctionValue(state, functionName) {
  if (!state.functions[functionName] || !state.functions[functionName].parsed) {
    return;
  }
  let arity = functionName.split("/")[1];
  state.functions[functionName].errorMessage =
      validateStructureFunctions(state.functions[functionName].parsed, state.domain.parsed, arity);
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
  if (tuple.length === 0) {
    return '';
  }
  if (tuple.length === 1) {
    return tuple[0];
  }
  return "(" + tuple.join(", ") + ")"
}

function parsedToValue(parsedValues) {
  if (parsedValues === undefined || parsedValues.length === 0) {
    return '';
  }
  return parsedValues.map(value => tupleToString(value)).join(", ");
}

export default structureReducer;