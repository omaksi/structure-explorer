import {
  lockConstantValue,
  lockDomain,
  lockFunctionValue,
  lockPredicateValue,
  setConstantValue,
  setDiagramModel,
  setFunctionValueTable,
  setFunctionValueText,
  setPredicateValueTable,
  setPredicateValueText,
  toggleDatabase,
  toggleTable,
  renameDomainNode,
  syncDiagram,
  addDomainNode,
  removeDomainNode,
  addConstantNode,
  removeConstantNode,
  checkBadName,
  addUnaryPredicate,
  removeUnaryPredicate, toggleEditableNodes,
} from "../actions";
import {connect} from 'react-redux';
import {BodyWidget} from "../../graph_view/components/BodyWidget";

const mapStateToProps = (state) => ({
  domain: [...state.structureObject.domain],
  language: state.language,
  structure: state.structure,
  diagramState: state.diagramState
});

const mapDispatchOnProps = {
  setDiagramModel:setDiagramModel,
  syncDiagram:syncDiagram,
  renameDomainNode:renameDomainNode,
  setConstantValue: setConstantValue,
  checkBadName:checkBadName,
  addDomainNode:addDomainNode,
  removeDomainNode:removeDomainNode,
  addConstantNode:addConstantNode,
  removeConstantNode:removeConstantNode,
  setPredicateValueText: setPredicateValueText,
  setPredicateValueTable: setPredicateValueTable,
  setFunctionValueText: setFunctionValueText,
  setFunctionValueTable: setFunctionValueTable,
  toggleTable: toggleTable,
  toggleDatabase:toggleDatabase,
  lockDomain: lockDomain,
  lockConstantValue: lockConstantValue,
  lockPredicateValue: lockPredicateValue,
  lockFunctionValue: lockFunctionValue,
  addUnaryPredicate: addUnaryPredicate,
  removeUnaryPredicate: removeUnaryPredicate,
  toggleEditableNodes: toggleEditableNodes
};

const DiagramModelContainer = connect(
   mapStateToProps,
   mapDispatchOnProps
)(BodyWidget);

export default DiagramModelContainer;