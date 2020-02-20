import {
  lockConstantValue,
  lockDomain, lockFunctionValue, lockPredicateValue,
  setConstantValue,
  setDiagramModel,
  setDomain, setFunctionValueTable, setFunctionValueText,
  setPredicateValueTable,
  setPredicateValueText, toggleDatabase, toggleTable
} from "../actions/index";
import {connect} from 'react-redux';
import {BodyWidget} from "../diagram/components/BodyWidget";

const mapStateToProps = (state,ownProps) => ({
  diagramModel: state.diagramModel,
  language: state.language,
  structure: state.structure,
  structureObject: state.structureObject,
  teacherMode: state.common.teacherMode,
  domain: [...state.structureObject.domain]
});

const mapDispatchOnProps = {
  setDiagramModel:setDiagramModel,
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

const DiagramModelContainer = connect(
   mapStateToProps,
   mapDispatchOnProps
)(BodyWidget);

export default DiagramModelContainer;