import {defaultExpressionData, FORMULA, TERM} from "../../constants";
import {
  defaultHintikkaGameData, GAME_EQUIVALENCE,
  GAME_IMPLICATION,
  GAME_OPERATOR,
  GAME_QUANTIFIER,
  NEGATION
} from "../../constants/gameConstants";
import Implication from "../../model/formula/Formula.Implication";
import {
  ADD_EXPRESSION,
  RENAME_DOMAIN_NODE,
  CHECK_SYNTAX,
  IMPORT_APP,
  LOCK_EXPRESSION_ANSWER,
  LOCK_EXPRESSION_VALUE,
  REMOVE_EXPRESSION,
  SET_CONSTANT_VALUE,
  SET_CONSTANTS,
  SET_EXPRESSION_ANSWER,
  SET_FUNCTION_VALUE_TABLE,
  SET_FUNCTION_VALUE_TEXT,
  SET_FUNCTIONS,
  SET_PREDICATE_VALUE_TABLE,
  SET_PREDICATE_VALUE_TEXT,
  SET_PREDICATES,
  SET_VARIABLES_VALUE,
  ADD_DOMAIN_NODE,
  SET_CONSTANT_VALUE_FROM_LINK,
  REMOVE_CONSTANT_NODE,
  ADD_UNARY_PREDICATE,
  REMOVE_UNARY_PREDICATE,
  ADD_BINARY_PREDICATE,
  REMOVE_BINARY_PREDICATE,
  ADD_CONSTANT_NODE,
  RENAME_CONSTANT_NODE,
  REMOVE_DOMAIN_NODE,
  ADD_TERNARY_PREDICATE,
  REMOVE_TERNARY_PREDICATE,
  ADD_QUATERNARY_PREDICATE,
  REMOVE_QUATERNARY_PREDICATE,
  ADD_BINARY_FUNCTION,
  REMOVE_BINARY_FUNCTION,
  ADD_TERNARY_FUNCTION,
  REMOVE_TERNARY_FUNCTION,
  ADD_UNARY_FUNCTION,
  REMOVE_UNARY_FUNCTION,
  REMOVE_QUATERNARY_NODE,
  REMOVE_TERNARY_NODE,
  IMPORT_DIAGRAM_STATE,
  CHANGE_DIRECTION_OF_BINARY_RELATION,
  INITIATE_GAME,
  SET_GAME_COMMITMENT,
  CONTINUE_GAME,
  SET_GAME_DOMAIN_CHOICE, SET_GAME_NEXT_FORMULA, END_GAME, GO_BACK, GET_VARIABLES
} from "../actions/action_types";
import {getStructureObject} from "../selectors/structureObject";
import {parseExpression} from "./functions/parsers";
import {RULE_FORMULA, RULE_TERM} from "../../constants/parser_start_rules";
import Conjunction from "../../model/formula/Formula.Conjunction";
import Disjunction from "../../model/formula/Formula.Disjunction";
import Variable from "../../model/term/Term.Variable";
import Constant from "../../model/term/Term.Constant";
import ExistentialQuant from "../../model/formula/Formula.ExistentialQuant";
import UniversalQuant from "../../model/formula/Formula.UniversalQuant";
import FunctionTerm from "../../model/term/Term.FunctionTerm";
import PredicateAtom from "../../model/formula/Formula.PredicateAtom";
import Negation from "../../model/formula/Formula.Negation";
import EqualityAtom from "../../model/formula/Formula.EqualityAtom";
import produce from "immer";
import {getVariableObject} from "../selectors/variableObject";

export function defaultState(){
  return {
    formulas: [],
    terms: []
  }
}

const expressionsReducer = produce((expressions, action, state) => {
  let variablesObject = getVariableObject(state);
  switch (action.type) {
    case SET_CONSTANTS:
    case SET_PREDICATES:
    case SET_FUNCTIONS:
    case IMPORT_APP:
      syncExpressionsValue(expressions, state, variablesObject,true);
      return expressions;
    case SET_CONSTANT_VALUE:
    case SET_PREDICATE_VALUE_TEXT:
    case SET_PREDICATE_VALUE_TABLE:
    case SET_FUNCTION_VALUE_TEXT:
    case SET_FUNCTION_VALUE_TABLE:
    case SET_VARIABLES_VALUE:
      syncExpressionsValue(expressions, state, variablesObject);
      return expressions;
    case ADD_EXPRESSION:
      addExpression(expressions, action.expressionType);
      return expressions;
    case REMOVE_EXPRESSION:
      removeExpression(expressions, action.expressionType, action.index);
      return expressions;
    case SET_EXPRESSION_ANSWER:
      setExpressionAnswer(expressions, action.expressionType, action.index, action.answer);
      return expressions;
    case LOCK_EXPRESSION_VALUE:
      lockExpressionValue(expressions, action.expressionType, action.expressionIndex);
      return expressions;
    case LOCK_EXPRESSION_ANSWER:
      lockExpressionAnswer(expressions, action.expressionType, action.expressionIndex);
      return expressions;
    case CHECK_SYNTAX:
      checkExpressionSyntax(expressions, state, action, variablesObject);
      return expressions;
    case ADD_DOMAIN_NODE:
    case RENAME_DOMAIN_NODE:
    case REMOVE_DOMAIN_NODE:
    case ADD_CONSTANT_NODE:
    case RENAME_CONSTANT_NODE:
    case REMOVE_CONSTANT_NODE:
    case ADD_UNARY_PREDICATE:
    case REMOVE_UNARY_PREDICATE:
    case ADD_UNARY_FUNCTION:
    case REMOVE_UNARY_FUNCTION:
    case ADD_BINARY_PREDICATE:
    case REMOVE_BINARY_PREDICATE:
    case ADD_TERNARY_PREDICATE:
    case REMOVE_TERNARY_PREDICATE:
    case ADD_QUATERNARY_PREDICATE:
    case REMOVE_QUATERNARY_PREDICATE:
    case ADD_BINARY_FUNCTION:
    case REMOVE_BINARY_FUNCTION:
    case ADD_TERNARY_FUNCTION:
    case REMOVE_TERNARY_FUNCTION:
    case REMOVE_TERNARY_NODE:
    case REMOVE_QUATERNARY_NODE:
    case SET_CONSTANT_VALUE_FROM_LINK:
    case IMPORT_DIAGRAM_STATE:
    case CHANGE_DIRECTION_OF_BINARY_RELATION:
      syncExpressionsValue(expressions, state, variablesObject,true);
      return expressions;
    case INITIATE_GAME:
      if(!expressions.formulas[action.index].parsed){
        return expressions;
      }
      expressions.formulas[action.index].gameEnabled = !expressions.formulas[action.index].gameEnabled;
      expressions.formulas[action.index].gameValue = expressions.formulas[action.index].parsed.createCopy();
      expressions.formulas[action.index].gameCommitment = null;
      expressions.formulas[action.index].gameHistory = [];
      expressions.formulas[action.index].showVariables = false;
      expressions.formulas[action.index].gameVariables = new Map(variablesObject);
      return expressions;
    case SET_GAME_COMMITMENT:
      expressions.formulas[action.index].gameCommitment = action.commitment;
      addToHistory(expressions, action.index, action.gameMessages, action.userMessages);
      return expressions;
    case CONTINUE_GAME:
      addToHistory(expressions, action.index, action.gameMessages, action.userMessages);
      let formulas = expressions.formulas[action.index].gameValue.getSubFormulas();
      switch(expressions.formulas[action.index].gameValue.getType(expressions.formulas[action.index].gameCommitment)){
        case NEGATION:
          expressions.formulas[action.index].gameCommitment = !expressions.formulas[action.index].gameCommitment;
          expressions.formulas[action.index].gameValue = formulas[0].createCopy();
          break;
        case GAME_OPERATOR:
          if(formulas[0].eval(getStructureObject(state), expressions.formulas[action.index].gameVariables) !== expressions.formulas[action.index].gameCommitment){
            expressions.formulas[action.index].gameValue = formulas[0].createCopy();
          } else if(formulas[1].eval(getStructureObject(state), expressions.formulas[action.index].gameVariables) !== expressions.formulas[action.index].gameCommitment){
            expressions.formulas[action.index].gameValue = formulas[1].createCopy();
          } else {
            expressions.formulas[action.index].gameValue = formulas[action.randomNumbers[0]].createCopy();
          }
          break;
        case GAME_IMPLICATION:
          if(formulas[0].eval(getStructureObject(state), expressions.formulas[action.index].gameVariables) === expressions.formulas[action.index].gameCommitment){
            expressions.formulas[action.index].gameValue = formulas[0].createCopy();
            expressions.formulas[action.index].gameCommitment = !expressions.formulas[action.index].gameCommitment;
          } else if(formulas[1].eval(getStructureObject(state), expressions.formulas[action.index].gameVariables) !== expressions.formulas[action.index].gameCommitment){
            expressions.formulas[action.index].gameValue = formulas[1].createCopy();
          } else {
            if(action.randomNumbers[0] === 0){
              expressions.formulas[action.index].gameValue = formulas[0].createCopy();
              expressions.formulas[action.index].gameCommitment = !expressions.formulas[action.index].gameCommitment;
            } else {
              expressions.formulas[action.index].gameValue = formulas[1].createCopy();
            }
          }
          break;
        case GAME_QUANTIFIER:
          let varName = 'n' + expressions.formulas[action.index].gameVariables.size;
          expressions.formulas[action.index].gameValue = expressions.formulas[action.index].gameValue.createCopy();
          expressions.formulas[action.index].gameValue.setVariable(expressions.formulas[action.index].gameValue.variableName, varName);
          let structureObject = getStructureObject(state);
          let noCounterExample = true;
          for (let item of structureObject.domain) {
            expressions.formulas[action.index].gameVariables.set(varName, item);
            if (expressions.formulas[action.index].gameValue.subFormula.eval(structureObject, expressions.formulas[action.index].gameVariables)
                !== expressions.formulas[action.index].gameCommitment) {
              noCounterExample = false;
              break;
            }
          }
          if(noCounterExample){
            expressions.formulas[action.index].gameVariables.set(varName, Array.from(structureObject.domain)[action.randomNumbers[1]]);
          }
          expressions.formulas[action.index].gameValue = expressions.formulas[action.index].gameValue.subFormula;
          break;
        case GAME_EQUIVALENCE:
          let leftImplication = new Implication(expressions.formulas[action.index].gameValue.subLeft, expressions.formulas[action.index].gameValue.subRight);
          let rightImplication = new Implication(expressions.formulas[action.index].gameValue.subRight, expressions.formulas[action.index].gameValue.subLeft);
          if(leftImplication.eval(getStructureObject(state), expressions.formulas[action.index].gameVariables) !== expressions.formulas[action.index].gameCommitment){
            expressions.formulas[action.index].gameValue = leftImplication;
          } if(rightImplication.eval(getStructureObject(state), expressions.formulas[action.index].gameVariables) !== expressions.formulas[action.index].gameCommitment){
            expressions.formulas[action.index].gameValue = rightImplication;
          } else {
            if(action.randomNumbers[0] === 0){
              expressions.formulas[action.index].gameValue = leftImplication;
            } else {
              expressions.formulas[action.index].gameValue = rightImplication;
            }
          }
          break;
        default:
          break;
      }
      return expressions;
    case SET_GAME_DOMAIN_CHOICE:
      addToHistory(expressions, action.index, action.gameMessages, action.userMessages);
      let varName = 'n' + expressions.formulas[action.index].gameVariables.size;
      expressions.formulas[action.index].gameVariables.set(varName, action.value);
      expressions.formulas[action.index].gameValue = expressions.formulas[action.index].gameValue.createCopy();
      expressions.formulas[action.index].gameValue.setVariable(expressions.formulas[action.index].gameValue.variableName, varName);
      expressions.formulas[action.index].gameValue = expressions.formulas[action.index].gameValue.subFormula;
      return expressions;
    case SET_GAME_NEXT_FORMULA:
      addToHistory(expressions, action.index, action.gameMessages, action.userMessages);
      expressions.formulas[action.index].gameValue = action.formula.createCopy();
      expressions.formulas[action.index].gameCommitment = action.commitment;
      return expressions;
    case END_GAME:
      expressions.formulas[action.index].gameEnabled = false;
      expressions.formulas[action.index].gameCommitment = null;
      expressions.formulas[action.index].gameHistory = [];
      expressions.formulas[action.index].gameValue = null;
      return expressions;
    case GET_VARIABLES:
      expressions.formulas[action.index].showVariables = !state.expressions.formulas[action.index].showVariables;
      return expressions;
    case GO_BACK:
      expressions.formulas[action.index].gameValue = expressions.formulas[action.index].gameHistory[action.historyIndex].gameValue.createCopy();
      expressions.formulas[action.index].gameVariables = new Map(expressions.formulas[action.index].gameHistory[action.historyIndex].gameVariables);
      if(action.historyIndex === 0){
        expressions.formulas[action.index].gameCommitment = null;
      } else {
        expressions.formulas[action.index].gameCommitment = expressions.formulas[action.index].gameHistory[action.historyIndex].gameCommitment;
      }
      let newHistory = [];
      for(let i = 0; i < expressions.formulas[action.index].gameHistory.length; i++){
          if(i < action.historyIndex){
            newHistory.push({
              gameCommitment: expressions.formulas[action.index].gameHistory[i].gameCommitment,
              gameValue: expressions.formulas[action.index].gameHistory[i].gameValue.createCopy(),
              gameVariables: new Map(expressions.formulas[action.index].gameHistory[i].gameVariables),
              gameMessages: expressions.formulas[action.index].gameHistory[i].gameMessages,
              userMessages: expressions.formulas[action.index].gameHistory[i].userMessages
            })
          }
      }
      expressions.formulas[action.index].gameHistory = newHistory;
      return expressions
    default:
      return expressions;
  }
})

function addExpression(expressions, expressionType) {
  if (expressionType === FORMULA) {
    expressions.formulas.push({...defaultExpressionData(), ...defaultHintikkaGameData()});
  } else if (expressionType === TERM) {
    expressions.terms.push(defaultExpressionData());
  }
}

function removeExpression(expressions, expressionType, expressionIndex) {
  if (expressionType === FORMULA && expressionIndex < expressions.formulas.length) {
    expressions.formulas.splice(expressionIndex, 1);
  } else if (expressionType === TERM && expressionIndex < expressions.terms.length) {
    expressions.terms.splice(expressionIndex, 1);
  }
}

function syncExpressionsValue(expressions, state, variables, parse = false) {
  expressions.formulas.forEach(formula => {
    if (parse) {
      parseExpression(formula, formula.value, state, FORMULA);
      // noinspection JSUndefinedPropertyAssignment
    }
    evalExpression(state, formula, variables);
  });
  expressions.terms.forEach(term => {
    if (parse) {
      parseExpression(term, term.value, state, TERM);
    }
    evalExpression(state, term, variables);
  });
}

function evalExpression(state, expression, variables) {
  if (!expression.parsed || expression.parsed.length === 0) {
    return;
  }
  expression.errorMessage = '';
  try {
    expression.expressionValue = expression.parsed.eval(getStructureObject(state), variables);
  } catch (e) {
    expression.errorMessage = e;
    expression.expressionValue = null;
  }
}

function checkExpressionSyntax(expressions, state, action, variables) {
  let expressionText = action.value;
  let expression = expressions.terms[action.index];
  if (action.expressionType === FORMULA) {
    expression = expressions.formulas[action.index];
  }
  parseExpression(expression, expressionText, state, action.expressionType);
  expression.value = action.value; // aby tam neboli zatvorky
  if (expression.errorMessage.length === 0) {
    expression.validSyntax = true;
    evalExpression(state, expression, variables);
  } else {
    expression.validSyntax = false;
  }
}

function setExpressionAnswer(expressions, expressionType, expressionIndex, answer) {
  if (expressionType === FORMULA && expressionIndex < expressions.formulas.length) {
    let ans = (answer === 'true');
    if (answer === '-1')
      ans = '-1';
    expressions.formulas[expressionIndex].answerValue = ans;
  } else if (expressionType === TERM && expressionIndex < expressions.terms.length) {
    expressions.terms[expressionIndex].answerValue = answer;
  }
}

function lockExpressionAnswer(expressions, expressionType, expressionIndex) {
  if (expressionType === FORMULA && expressionIndex < expressions.formulas.length) {
    expressions.formulas[expressionIndex].answerLocked = !expressions.formulas[expressionIndex].answerLocked;
  } else if (expressionType === TERM && expressionIndex < expressions.terms.length) {
    expressions.terms[expressionIndex].answerLocked = !expressions.terms[expressionIndex].answerLocked;
  }
}

function lockExpressionValue(expressions, expressionType, expressionIndex) {
  if (expressionType === FORMULA && expressionIndex < expressions.formulas.length) {
    expressions.formulas[expressionIndex].inputLocked = !expressions.formulas[expressionIndex].inputLocked;
  } else if (expressionType === TERM && expressionIndex < expressions.terms.length) {
    expressions.terms[expressionIndex].inputLocked = !expressions.terms[expressionIndex].inputLocked;
  }
}

function addToHistory(expressions, index, gameMessages, userMessages){
  let gameValueCopy = expressions.formulas[index].gameValue != null ? expressions.formulas[index].gameValue.createCopy() : null;
  let entry = {
    gameCommitment: expressions.formulas[index].gameCommitment,
    gameValue: gameValueCopy,
    gameVariables: new Map(expressions.formulas[index].gameVariables),
    gameMessages: gameMessages,
    userMessages: userMessages
  };
  expressions.formulas[index].gameHistory.push(entry);
}

export default expressionsReducer;