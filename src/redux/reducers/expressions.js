import {defaultExpressionData, FORMULA, TERM} from "../../constants";
import {
  defaultHintikkaGameData,
  GAME_IMPLICATION,
  GAME_OPERATOR,
  GAME_QUANTIFIER,
  NEGATION
} from "../../constants/gameConstants";
import EqualityAtom from "../../model/formula/Formula.EqualityAtom";
import Disjunction from "../../model/formula/Formula.Disjunction";
import PredicateAtom from "../../model/formula/Formula.PredicateAtom";
import Negation from "../../model/formula/Formula.Negation";
import Constant from "../../model/term/Term.Constant";
import Implication from "../../model/formula/Formula.Implication";
import Conjunction from "../../model/formula/Formula.Conjunction";
import Variable from "../../model/term/Term.Variable";
import FunctionTerm from "../../model/term/Term.FunctionTerm";
import UniversalQuant from "../../model/formula/Formula.UniversalQuant";
import ExistentialQuant from "../../model/formula/Formula.ExistentialQuant";
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
  SET_GAME_DOMAIN_CHOICE, SET_GAME_NEXT_FORMULA, END_GAME, GO_BACK
} from "../actions/action_types";
import {RULE_FORMULA, RULE_TERM} from "../../constants/parser_start_rules";
import {getStructureObject} from "../selectors/structureObject";

let functions = require('./functions/functions');

let s = {};

export function defaultState(){
  return {
    formulas: [],
    terms: []
  }
}

function expressionsReducer(state = {}, action, variables, wholeState) {
  s = copyState(state);
  switch (action.type) {
    case SET_CONSTANTS:
    case SET_PREDICATES:
    case SET_FUNCTIONS:
    case IMPORT_APP:
      syncExpressionsValue(wholeState, true);
      return state;
    case SET_CONSTANT_VALUE:
    case SET_PREDICATE_VALUE_TEXT:
    case SET_PREDICATE_VALUE_TABLE:
    case SET_FUNCTION_VALUE_TEXT:
    case SET_FUNCTION_VALUE_TABLE:
    case SET_VARIABLES_VALUE:
      syncExpressionsValue(wholeState);
      return state;
    case ADD_EXPRESSION:
      addExpression(action.expressionType);
      return s;
    case REMOVE_EXPRESSION:
      removeExpression(action.expressionType, action.index);
      return s;
    case SET_EXPRESSION_ANSWER:
      setExpressionAnswer(action.expressionType, action.index, action.answer);
      return s;
    case LOCK_EXPRESSION_VALUE:
      lockExpressionValue(action.expressionType, action.expressionIndex);
      return s;
    case LOCK_EXPRESSION_ANSWER:
      lockExpressionAnswer(action.expressionType, action.expressionIndex);
      return s;
    case CHECK_SYNTAX:
      checkExpressionSyntax(wholeState, action, variables);
      return s;
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
      syncExpressionsValue(wholeState, true);
      return s;
    case INITIATE_GAME:
      s.formulas[action.index].gameEnabled = !s.formulas[action.index].gameEnabled;
      s.formulas[action.index].gameValue = s.formulas[action.index].parsed.createCopy();
      s.formulas[action.index].gameCommitment = null;
      s.formulas[action.index].gameHistory = [];
      s.formulas[action.index].gameVariables = new Map(variables);
      return s;
    case SET_GAME_COMMITMENT:
      addToHistory(s, action.index, action.gameMessages, action.userMessages);
      s.formulas[action.index].gameCommitment = action.commitment;
      return s;
    case CONTINUE_GAME:
      addToHistory(s, action.index, action.gameMessages, action.userMessages);
      let formulas = s.formulas[action.index].gameValue.getSubFormulas();
      switch(s.formulas[action.index].gameValue.getType(s.formulas[action.index].gameCommitment)){
        case NEGATION:
          s.formulas[action.index].gameCommitment = !s.formulas[action.index].gameCommitment;
          s.formulas[action.index].gameValue = formulas[0].createCopy();
          break;
        case GAME_OPERATOR:
        case GAME_IMPLICATION:
          if(formulas[0].eval(getStructureObject(wholeState), s.formulas[action.index].gameVariables) !== s.formulas[action.index].gameCommitment){
              s.formulas[action.index].gameValue = formulas[0].createCopy();
            } else {
              s.formulas[action.index].gameValue = formulas[1].createCopy();
            }
          break;
        case GAME_QUANTIFIER:
          let varName = 'n' + s.formulas[action.index].gameVariables.size;
          s.formulas[action.index].gameValue = s.formulas[action.index].gameValue.createCopy();
          s.formulas[action.index].gameValue.setVariable(s.formulas[action.index].gameValue.variableName, varName);
          let structureObject = getStructureObject(wholeState);
          for (let item of structureObject.domain) {
            s.formulas[action.index].gameVariables.set(varName, item);
            if (s.formulas[action.index].gameValue.subFormula.eval(structureObject, s.formulas[action.index].gameVariables)
                !== s.formulas[action.index].gameCommitment) {
              break;
            }
          }
          s.formulas[action.index].gameValue = s.formulas[action.index].gameValue.subFormula;
          break;
        default:
          break;
      }
      return s;
    case SET_GAME_DOMAIN_CHOICE:
      addToHistory(s, action.index, action.gameMessages, action.userMessages);
      let varName = 'n' + s.formulas[action.index].gameVariables.size;
      s.formulas[action.index].gameVariables.set(varName, action.value);
      s.formulas[action.index].gameValue = s.formulas[action.index].gameValue.createCopy();
      s.formulas[action.index].gameValue.setVariable(s.formulas[action.index].gameValue.variableName, varName);
      s.formulas[action.index].gameValue = s.formulas[action.index].gameValue.subFormula;
      return s;
    case SET_GAME_NEXT_FORMULA:
      addToHistory(s, action.index, action.gameMessages, action.userMessages);
      s.formulas[action.index].gameValue = action.formula.createCopy();
      s.formulas[action.index].gameCommitment = action.commitment;
      return s;
    case END_GAME:
      s.formulas[action.index].gameEnabled = false;
      s.formulas[action.index].gameCommitment = null;
      s.formulas[action.index].gameHistory = [];
      s.formulas[action.index].gameValue = null;
      return s;
    case GO_BACK:
      s.formulas[action.index].gameValue = s.formulas[action.index].gameHistory[action.historyIndex].gameValue.createCopy();
      s.formulas[action.index].gameVariables = new Map(s.formulas[action.index].gameHistory[action.historyIndex].gameVariables);
      s.formulas[action.index].gameCommitment = s.formulas[action.index].gameHistory[action.historyIndex].gameCommitment;
      let newHistory = [];
      for(let i = 0; i < s.formulas[action.index].gameHistory.length; i++){
          if(i < action.historyIndex){
            newHistory.push({
              gameCommitment: s.formulas[action.index].gameHistory[i].gameCommitment,
              gameValue: s.formulas[action.index].gameHistory[i].gameValue.createCopy(),
              gameVariables: new Map(s.formulas[action.index].gameHistory[i].gameVariables),
              gameMessages: s.formulas[action.index].gameHistory[i].gameMessages,
              userMessages: s.formulas[action.index].gameHistory[i].userMessages
            })
          }
      }
      s.formulas[action.index].gameHistory = newHistory;
      return s
    default:
      return s;
  }
}

function addExpression(expressionType) {
  if (expressionType === FORMULA) {
    s.formulas.push({...defaultExpressionData(), ...defaultHintikkaGameData()});
  } else if (expressionType === TERM) {
    s.terms.push(defaultExpressionData());
  }
}

function removeExpression(expressionType, expressionIndex) {
  if (expressionType === FORMULA && expressionIndex < s.formulas.length) {
    s.formulas.splice(expressionIndex, 1);
  } else if (expressionType === TERM && expressionIndex < s.terms.length) {
    s.terms.splice(expressionIndex, 1);
  }
}

function syncExpressionsValue(state, variables, parse = false) {
  s.formulas.forEach(formula => {
    if (parse) {
      let temp = formula.value;
      functions.parseText(`(${temp})`, formula, setParserOptions(state, RULE_FORMULA));
      // noinspection JSUndefinedPropertyAssignment
      formula.value = temp;
    }
    evalExpression(state, formula, variables);
  });
  s.terms.forEach(term => {
    if (parse) {
      functions.parseText(term.value, term, setParserOptions(state, RULE_TERM));
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
    let structureObject = getStructureObject(state);
    expression.expressionValue = expression.parsed.eval(structureObject, variables);
  } catch (e) {
    expression.errorMessage = e;
    expression.expressionValue = null;
  }
}

function checkExpressionSyntax(state, action, variables) {
  let expressionText = action.value;
  let expression = s.terms[action.index];
  if (action.expressionType === FORMULA) {
    if (expressionText.length > 0) {
      expressionText = '(' + expressionText + ')';
    }
    expression = s.formulas[action.index];
  }
  functions.parseText(expressionText, expression, setParserOptions(state, action.expressionType.toLowerCase()));
  expression.value = action.value; // aby tam neboli zatvorky
  if (expression.errorMessage.length === 0) {
    expression.validSyntax = true;
    evalExpression(state, expression, variables);
  } else {
    expression.validSyntax = false;
  }
}

function setExpressionAnswer(expressionType, expressionIndex, answer) {
  if (expressionType === FORMULA && expressionIndex < s.formulas.length) {
    let ans = (answer === 'true');
    if (answer === '-1')
      ans = '-1';
    s.formulas[expressionIndex].answerValue = ans;
  } else if (expressionType === TERM && expressionIndex < s.terms.length) {
    s.terms[expressionIndex].answerValue = answer;
  }
}

function lockExpressionAnswer(expressionType, expressionIndex) {
  if (expressionType === FORMULA && expressionIndex < s.formulas.length) {
    s.formulas[expressionIndex].answerLocked = !s.formulas[expressionIndex].answerLocked;
  } else if (expressionType === TERM && expressionIndex < s.terms.length) {
    s.terms[expressionIndex].answerLocked = !s.terms[expressionIndex].answerLocked;
  }
}

function lockExpressionValue(expressionType, expressionIndex) {
  if (expressionType === FORMULA && expressionIndex < s.formulas.length) {
    s.formulas[expressionIndex].inputLocked = !s.formulas[expressionIndex].inputLocked;
  } else if (expressionType === TERM && expressionIndex < s.terms.length) {
    s.terms[expressionIndex].inputLocked = !s.terms[expressionIndex].inputLocked;
  }
}

function addToHistory(state, index, gameMessages, userMessages){
  let gameValueCopy = state.formulas[index].gameValue != null ? state.formulas[index].gameValue.createCopy() : null;
  let entry = {
    gameCommitment: state.formulas[index].gameCommitment,
    gameValue: gameValueCopy,
    gameVariables: new Map(state.formulas[index].gameVariables),
    gameMessages: gameMessages,
    userMessages: userMessages
  };
  s.formulas[index].gameHistory.push(entry);
  console.log(s.formulas[index].gameHistory);
}

function copyState(state){
  let newState = defaultState();
  for(let formula of state.formulas){
    let newFormula = {...defaultExpressionData(), ...defaultHintikkaGameData()}
    newFormula.value = formula.value;
    newFormula.expressionValue = formula.expressionValue;
    newFormula.answerValue = formula.answerValue;
    newFormula.errorMessage = formula.errorMessage;
    newFormula.inputLocked = formula.inputLocked;
    newFormula.answerLocked = formula.answerLocked;
    newFormula.validSyntax = formula.validSyntax;
    newFormula.gameCommitment = formula.gameCommitment;
    newFormula.gameEnabled = formula.gameEnabled;
    newFormula.gameVariables = new Map(formula.gameVariables);
    newFormula.gameHistory = [];
    for(let entry of formula.gameHistory){
      let newEntry = {
        gameCommitment: entry.gameCommitment,
        gameValue: entry.gameValue.createCopy(),
        gameVariables: new Map(entry.gameVariables),
        gameMessages: entry.gameMessages,
        userMessages: entry.userMessages
      };
      newFormula.gameHistory.push(newEntry);
    }
    newFormula.gameValue = formula.gameValue ? formula.gameValue.createCopy() : null;
    newFormula.parsed = formula.parsed ? formula.parsed.createCopy() : null;
    newState.formulas.push(newFormula);
  }
  for(let term of state.terms){
    let newTerm = {...defaultExpressionData()}
    newTerm.value = term.value;
    newTerm.expressionValue = term.expressionValue;
    newTerm.answerValue = term.answerValue;
    newTerm.errorMessage = term.errorMessage;
    newTerm.inputLocked = term.inputLocked;
    newTerm.answerLocked = term.answerLocked;
    newTerm.validSyntax = term.validSyntax;
    newTerm.parsed = term.parsed ? term.parsed.createCopy() : null;
    newState.terms.push(newTerm);
  }
  return newState;
}

const setParserOptions = (state, startRule) => ({
  startRule: startRule,
  structure: getStructureObject(state),
  conjunction: Conjunction,
  disjunction: Disjunction,
  implication: Implication,
  variable: Variable,
  constant: Constant,
  existentialQuant: ExistentialQuant,
  universalQuant: UniversalQuant,
  functionTerm: FunctionTerm,
  predicate: PredicateAtom,
  negation: Negation,
  equalityAtom: EqualityAtom
});

export default expressionsReducer;