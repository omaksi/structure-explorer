import {
  ADD_CONSTANT_NODE,
  ADD_DOMAIN_NODE, RENAME_DOMAIN_NODE, CHECK_BAD_NAME, REMOVE_CONSTANT_NODE,
  REMOVE_DOMAIN_NODE,
  SET_DIAGRAM,
  SYNC_DIAGRAM, SYNC_MATH_STATE, TOGGLE_EDITABLE_NODES, RENAME_CONSTANT_NODE, GET_PREDICATES
} from "../actions/action_types";
import {UnBinaryNodeModel} from "../../graph_view/nodes/unbinary/UnBinaryNodeModel";
import {UNBINARY} from "../../graph_view/nodes/ConstantNames";
import {ConstantNodeModel} from "../../graph_view/nodes/constant/ConstantNodeModel";
import {DiagramModel} from "@projectstorm/react-diagrams";
import {BinaryLinkModel} from "../../graph_view/links/binary/BinaryLinkModel";
import {DiagramApplication} from "../../graph_view/DiagramAplication";
import _ from "lodash";

export function defaultState(){
  let diagramModel = new DiagramModel();
  return{
    diagramModel: diagramModel,
    diagramEngine: new DiagramApplication(diagramModel).diagramEngine,
    domainNodes: new Map(),
    constantNodes: new Map(),
    functionNodes: new Map(),
    editableNodes: false
  }
}

function diagramReducer(state, action) {
  switch (action.type) {
    case SET_DIAGRAM:
      state.diagramModel = action.diagramModel;
      return state;
    case SYNC_DIAGRAM:
      syncDomain(action.value);
      syncPredicates(action.value);
      syncConstants(action.value);
      syncLabels(state);
      return state;
    case ADD_DOMAIN_NODE:
      state.domainNodes.set(action.nodeName, action.nodeObject);
      return state;
    case REMOVE_DOMAIN_NODE:
      state.domainNodes.delete(action.nodeName);
      return state;
    case ADD_CONSTANT_NODE:
      state.constantNodes.set(action.nodeName, action.nodeObject);
      return state;
    case REMOVE_CONSTANT_NODE:
      state.constantNodes.delete(action.nodeName);
      return state;
    case CHECK_BAD_NAME:
      checkIfNameCanBeUsed(state, action);
      return state;
    case RENAME_DOMAIN_NODE:
      state.domainNodes.set(action.newName, state.domainNodes.get(action.oldName));
      state.domainNodes.delete(action.oldName);
      return state;
    case RENAME_CONSTANT_NODE:
      state.constantNodes.set(action.newName, state.constantNodes.get(action.oldName));
      state.constantNodes.delete(action.oldName);
      return state;
    case SYNC_MATH_STATE:
      deleteAllLabels(state);
      return state;
    case TOGGLE_EDITABLE_NODES:
      let nodeArray = state.diagramModel.getNodes();
      for (let a = 0; a < nodeArray.length; a++) {
        nodeArray[a].changeEditableState(action.value);
      }

      let linkArray = state.diagramModel.getLinks();
      for (let i = 0; i < linkArray.length; i++) {
        let labelArray = linkArray[i].getLabels();
        for (let y = 0; y < labelArray.length; y++) {
          labelArray[y].changeEditableState(action.value);
        }
      }
      state.diagramEngine.repaintCanvas();
      return {...state, editableNodes: action.value};
    default:
      return state;
  }
}

function syncLabels(state){
  let linkArray = state.diagramModel.getLinks();
  for (let i = 0; i<linkArray.length;i++) {
    if(linkArray[i].label && linkArray[i].getLabels().length === 0){
      linkArray[i].addLabel(linkArray[i].label);
    }
  }
}

function deleteAllLabels(action) {
  let linkArray = action.diagramModel.getLinks();
  for(let i = 0; i<linkArray.length;i++){
    if (linkArray[i] instanceof BinaryLinkModel) {
      linkArray[i].clearLabels();
    }
  }
}

function checkIfNameCanBeUsed(state,action){
  if(action.oldName === action.newName){
    action.nodeBadNameSetState(false);
    return;
  }

  if(action.newName.length === 0 ){
    action.nodeBadNameSetState(true);
    return;
  }

  if(action.newName.includes(",")){
    action.nodeBadNameSetState(true);
    return;
  }

  let nodes;
  if(action.nodeType === UNBINARY){
    nodes = state.domainNodes;
  }
  //REWORK
  else{
    nodes = state.constantNodes;
  }

  if(nodes.has(action.newName)){
    action.nodeBadNameSetState(true);
  }
  else{
    action.nodeBadNameSetState(false);
  }
}

function createNode(nodeObject,nodeName,nameOfSet,diagramModel,diagramCanvas){
  let canvasWidth = diagramCanvas.clientWidth;
  let canvasHeight = diagramCanvas.clientHeight;

  nodeObject.setPosition(Math.random() * (canvasWidth - canvasWidth * 0.1) + canvasWidth * 0.05, Math.random() * (canvasHeight - canvasHeight * 0.1) + canvasHeight * 0.05);
  addNodeState(nodeName, nodeObject, nameOfSet);
  diagramModel.addNode(nodeObject);
}

function createLink(sourcePort,targetPort,diagramModel){
  let link = new BinaryLinkModel({},false);
  link.setSourcePort(sourcePort);
  link.setTargetPort(targetPort);
  diagramModel.addAll(link);
}

function syncConstants(values){
  if(values.structure.constants!== null){
    let constantObjects = new Map(Object.entries(values.structure.constants));
    let constantState = values.diagramState.constantNodes;
    let domainState = values.diagramState.domainNodes;
    let diagramModel = values.diagramState.diagramModel;
    let diagramCanvas = values.diagramState.diagramEngine.getCanvas();

    for(let [nodeName,nodeObject] of constantState.entries()) {
      if (!constantObjects.has(nodeName)) {
        removeNodeState(nodeName, constantState);
        removeWholeNode(nodeObject, diagramModel);
      }
    }

    for(let [nodeName,nodeProperties] of constantObjects.entries()) {
      if(!constantState.has(nodeName)) {
        let node = new ConstantNodeModel(nodeName, 'rgb(92,192,125)', {
          "addConstantNode": values.addConstantNode,
          "renameConstantNode": values.renameConstantNode,
          "removeConstantNode": values.removeConstantNode,
          "checkBadName":values.checkBadName,
          "editable":values.diagramState.editableNodes,
          "setConstantValueFromLink":values.setConstantValueFromLink
        });
        createNode(node,nodeName,constantState,diagramModel,diagramCanvas);
        if(nodeProperties.value.length!==0){
          createLink(node.getMainPort(),domainState.get(nodeProperties.value).getMainPort(),diagramModel);
        }
      }
      else{
        let nodeObject = constantState.get(nodeName);

        //When entity is removed it would cause a dispatch of another Redux Function and we would get error, by setting callReduxFunc on false we will avoid this problem
        interruptCallingReduxFunc(nodeObject.getMainPort());

        nodeObject.removeAllLinks();
        if(nodeProperties.value.length!==0){
          createLink(nodeObject.getMainPort(),domainState.get(nodeProperties.value).getMainPort(),diagramModel);
        }
      }
    }
  }
}

function interruptCallingReduxFunc(port){
  for (let link of _.values(port.getLinks())) {
    if(link instanceof BinaryLinkModel){
      link.setCallReduxFunc(false);
    }
  }
}

function addNodeState(nodeName,nodeObject,nodeSet){
  nodeSet.set(nodeName,nodeObject);
}

function removeNodeState(nodeName,nodeSet){
  nodeSet.delete(nodeName);
}

function clearDiagramState(values){
  values.diagramState.domainNodes.clear();
  values.diagramState.constantNodes.clear();
  values.diagramState.functionNodes.clear();
}

function clearCertainNodeState(nodeState){
  nodeState.clear();
}

//atm refers all predicates to have unary level
function syncPredicates(values) {
  let predicatesObjects = values.structure.predicates;
  let domainState = values.diagramState.domainNodes;
  let portMap = new Map();

  if (predicatesObjects && Object.keys(predicatesObjects).length > 0) {
    for (let [key, value] of Object.entries(predicatesObjects)) {
      let parsedNodeValues = value.parsed;
      if (parsedNodeValues) {
        let keyWithoutArity = key.split('/')[0];
        let arityWithoutKey = key.split('/')[1];

        if (arityWithoutKey === '1') {
          parsedNodeValues.map((currentNodeVal) => {
            let currentNodeValue = currentNodeVal[0];
            if (portMap.has(currentNodeValue)) {
              portMap.get(currentNodeValue).add(keyWithoutArity);
            } else {
              portMap.set(currentNodeValue, new Set());
              portMap.get(currentNodeValue).add(keyWithoutArity);
            }
          });
        } else {

        }
      }

      for (let [currentNodeName, currentNodeObject] of domainState.entries()) {

        let setOfPredicatesForNode = portMap.get(currentNodeName);
        let nodePredicates = currentNodeObject.getUnaryPredicates();

        if (portMap.has(currentNodeName)) {
          for(let predicateName of setOfPredicatesForNode){
            if (!nodePredicates.has(predicateName)) {
              currentNodeObject.addUnaryPredicateToSet(predicateName);
            }
          }
        }

        for (let predicate of nodePredicates) {
          if (!setOfPredicatesForNode || !setOfPredicatesForNode.has(predicate)) {
            currentNodeObject.removeUnaryPredicateFromSet(predicate);
          }
        }
      }
    }
  }
  else{
    for (let [currentNodeName,currentNodeObject] of domainState.entries()) {
      currentNodeObject.clearPredicates();
    }
  }
}

function syncDomain(values) {
  let domain = (values.domain);
  let domainState = values.diagramState.domainNodes;
  let diagramModel = values.diagramState.diagramModel;
  let diagramCanvas = values.diagramState.diagramEngine.getCanvas();

  if (domain == null || domain.length === 0) {
    for(let node of domainState.values()){
      removeWholeNode(node, diagramModel);
    }
    clearCertainNodeState(domainState);
    return;
  }

  let existingDomainNodes = [];

  for (let [nodeName, nodeObject] of domainState.entries()) {
    if (domain.includes(nodeName)) {
      existingDomainNodes.push(nodeName);
    } else {
      removeNodeState(nodeName, domainState);
      removeWholeNode(nodeObject, diagramModel);
    }
  }

  console.log(values);
  console.log("domain",domain);

  domain.map(nodeName => {
    console.log("node name",nodeName);
    if (!existingDomainNodes.includes(nodeName)) {
      let node = new UnBinaryNodeModel(nodeName, 'rgb(92,192,125)', {
        "addDomainNode":values.addDomainNode,
        "renameDomainNode": values.renameDomainNode,
        "removeDomainNode":values.removeDomainNode,
        "checkBadName":values.checkBadName,
        "addUnaryPredicate":values.addUnaryPredicate,
        "removeUnaryPredicate":values.removeUnaryPredicate,
        "store":values.store,
        "editable":values.diagramState.editableNodes
      });
      createNode(node,nodeName,domainState,diagramModel,diagramCanvas);
    }
  });
}

function removeWholeNode(node,diagramModel){
  for(let portObject of Object.values(node.getPorts())){
    interruptCallingReduxFunc(portObject);
    node.removePort(portObject); //ensures that all links are deleted
  }
 diagramModel.removeNode(node);
}

export default diagramReducer;