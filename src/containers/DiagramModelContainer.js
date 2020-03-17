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
  syncDiagram, addDomainNode, removeDomainNode, addConstantNode, removeConstantNode, checkBadName,
} from "../actions/index";
import {connect} from 'react-redux';
import {BodyWidget} from "../diagram/components/BodyWidget";

const mapStateToProps = (state,ownProps) => ({
  diagramModel: state.diagramModel,
  domain: [...state.structureObject.domain],
  language: state.language,
  structure: state.structure,
  diagramNodeState: state.diagramNodeState
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
  lockFunctionValue: lockFunctionValue
};

const DiagramModelContainer = connect(
   mapStateToProps,
   mapDispatchOnProps
)(BodyWidget);

export default DiagramModelContainer;