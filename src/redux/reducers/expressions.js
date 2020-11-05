import {defaultExpressionData, FORMULA, TERM} from "../../math_view/constants";
import EqualityAtom from "../../math_view/model/formula/Formula.EqualityAtom";
import Disjunction from "../../math_view/model/formula/Formula.Disjunction";
import PredicateAtom from "../../math_view/model/formula/Formula.PredicateAtom";
import Negation from "../../math_view/model/formula/Formula.Negation";
import Constant from "../../math_view/model/term/Term.Constant";
import Implication from "../../math_view/model/formula/Formula.Implication";
import Conjunction from "../../math_view/model/formula/Formula.Conjunction";
import Variable from "../../math_view/model/term/Term.Variable";
import FunctionTerm from "../../math_view/model/term/Term.FunctionTerm";
import UniversalQuant from "../../math_view/model/formula/Formula.UniversalQuant";
import ExistentialQuant from "../../math_view/model/formula/Formula.ExistentialQuant";
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
  IMPORT_DIAGRAM_STATE, CHANGE_DIRECTION_OF_BINARY_RELATION
} from "../actions/action_types";
import {RULE_FORMULA, RULE_TERM} from "../../math_view/constants/parser_start_rules";
import {getStructureObject} from "../selectors/structureObject";

let functions = require('./functions/functions');

let s = {};
let structure = null;
let e = new Map();

export function defaultState(){
  return {
    formulas: [],
    terms: []
  }
}

function expressionsReducer(state = s, action, variables) {
  s = state;
  structure = getStructureObject(s);
  e = variables;
  switch (action.type) {
    case SET_CONSTANTS:
    case SET_PREDICATES:
    case SET_FUNCTIONS:
    case IMPORT_APP:
      syncExpressionsValue(true);
      return state;
    case SET_CONSTANT_VALUE:
    case SET_PREDICATE_VALUE_TEXT:
    case SET_PREDICATE_VALUE_TABLE:
    case SET_FUNCTION_VALUE_TEXT:
    case SET_FUNCTION_VALUE_TABLE:
    case SET_VARIABLES_VALUE:
      syncExpressionsValue();
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
      checkExpressionSyntax(action);
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
      syncExpressionsValue(true);
      return s;
    default:
      return s;
  }
}

function addExpression(expressionType) {
  if (expressionType === FORMULA) {
    s.formulas.push(defaultExpressionData());
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

function syncExpressionsValue(parse = false) {
  s.formulas.forEach(formula => {
    if (parse) {
      let temp = formula.value;
      functions.parseText(`(${temp})`, formula, setParserOptions(RULE_FORMULA));
      // noinspection JSUndefinedPropertyAssignment
      formula.value = temp;
    }
    evalExpression(formula);
  });
  s.terms.forEach(term => {
    if (parse) {
      functions.parseText(term.value, term, setParserOptions(RULE_TERM));
    }
    evalExpression(term);
  });
}

function evalExpression(expression) {
  if (!expression.parsed || expression.parsed.length === 0) {
    return;
  }
  expression.errorMessage = '';
  try {
    expression.expressionValue = expression.parsed.eval(structure, e);
  } catch (e) {
    expression.errorMessage = e;
    expression.expressionValue = null;
  }
}

function checkExpressionSyntax(action) {
  let expressionText = action.value;
  let expression = s.terms[action.index];
  if (action.expressionType === FORMULA) {
    if (expressionText.length > 0) {
      expressionText = '(' + expressionText + ')';
    }
    expression = s.formulas[action.index];
  }
  functions.parseText(expressionText, expression, setParserOptions(action.expressionType.toLowerCase()));
  expression.value = action.value; // aby tam neboli zatvorky
  if (expression.errorMessage.length === 0) {
    expression.validSyntax = true;
    evalExpression(expression);
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

const setParserOptions = (startRule) => ({
  startRule: startRule,
  structure: structure,
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