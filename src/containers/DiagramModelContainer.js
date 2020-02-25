import {
  lockConstantValue,
  lockDomain, lockFunctionValue, lockPredicateValue,
  setConstantValue,
  setDiagramModel,
  setDomain, setFunctionValueTable, setFunctionValueText,
  setPredicateValueTable,
  setPredicateValueText, toggleDatabase, toggleTable, changeDomain, syncDiagram
} from "../actions/index";
import {connect} from 'react-redux';
import {BodyWidget} from "../diagram/components/BodyWidget";

const mapStateToProps = (state,ownProps) => ({
  diagramModel: state.diagramModel,
  domain: [...state.structureObject.domain],
  language: state.language,
  structure: state.structure
});

const mapDispatchOnProps = {
  setDiagramModel:setDiagramModel,
  syncDiagram:syncDiagram,
  setDomain: setDomain,
  changeDomain:changeDomain,
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