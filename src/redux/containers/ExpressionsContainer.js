import {connect} from 'react-redux';
import Expressions from "../../expressions_view/Expressions";
import {
  addExpression,
  checkExpressionSyntax,
  lockExpressionAnswer,
  lockExpressionValue,
  removeExpression,
  setExpressionAnswer
} from "../actions";
import {getStructureObject} from "../selectors/structureObject";

const mapStateToProps = (state,myprops) => ({
  formulas: state.expressions.formulas,
  terms: state.expressions.terms,
  domain: [...getStructureObject(state).domain],
  teacherMode: state.common.teacherMode,
  diagramModel:myprops.diagramModel
});

const mapDispatchToProps = {
  onInputChange: checkExpressionSyntax,
  addExpression: addExpression,
  removeExpression: removeExpression,
  setExpressionAnswer: setExpressionAnswer,
  lockExpressionValue: lockExpressionValue,
  lockExpressionAnswer: lockExpressionAnswer
};

const ExpressionContainer = connect(
   mapStateToProps,
   mapDispatchToProps
)(Expressions);

export default ExpressionContainer;