import {connect} from 'react-redux';
import {
  setConstantValue,
  setDomain,
  setFunctionValueTable,
  setFunctionValueText,
  setPredicateValueTable,
  setPredicateValueText, toggleDatabase,
  toggleTable
} from "../actions";
import Structure from '../../math_view/components/Structure';
import {lockConstantValue, lockDomain, lockFunctionValue, lockPredicateValue} from "../actions";
import {getStructureObject} from "../selectors/structureObject";

const mapStateToProps = (state) => ({
  language: state.language,
  structure: state.structure,
  structureObject: getStructureObject(state),
  teacherMode: state.common.teacherMode,
  domain: getStructureObject(state).domain,
  diagramModel:state.diagramModel
});

const mapDispatchToProps = {
  setDomain: setDomain,
  setConstantValue: setConstantValue,
  setPredicateValueText: setPredicateValueText,
  setPredicateValueTable: setPredicateValueTable,
  setFunctionValueText: setFunctionValueText,
  setFunctionValueTable: setFunctionValueTable,
  toggleTable: toggleTable,
  toggleDatabase:toggleDatabase,
  lockDomain: lockDomain,
  lockConstantValue: lockConstantValue,
  lockPredicateValue: lockPredicateValue,
  lockFunctionValue: lockFunctionValue
};

const StructureContainer = connect(
   mapStateToProps,
   mapDispatchToProps
)(Structure);

export default StructureContainer;