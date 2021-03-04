import {connect} from 'react-redux';
import Expressions from "../../expressions_view/Expressions";
import {
  addExpression,
  checkExpressionSyntax,
  lockExpressionAnswer,
  lockExpressionValue,
  removeExpression,
  setExpressionAnswer,
  initiateGame
} from "../actions";
import {getStructureObject} from "../selectors/structureObject";

const mapStateToProps = (state,props) => ({
  formulas: state.expressions.formulas,
  terms: state.expressions.terms,
  domain: [...getStructureObject(state).domain],
  teacherMode: state.common.teacherMode,
  diagramModel:props.diagramModel
});

const mapDispatchToProps = {
  onInputChange: checkExpressionSyntax,
  addExpression: addExpression,
  removeExpression: removeExpression,
  setExpressionAnswer: setExpressionAnswer,
  lockExpressionValue: lockExpressionValue,
  lockExpressionAnswer: lockExpressionAnswer,
  initiateGame: initiateGame
};

const ExpressionContainer = connect(
   mapStateToProps,
   mapDispatchToProps
)(Expressions);

export default ExpressionContainer;