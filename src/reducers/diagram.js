import {
  ADD_CONSTANT_NODE,
  ADD_DOMAIN_NODE, REMOVE_CONSTANT_NODE,
  REMOVE_DOMAIN_NODE,
  SET_DIAGRAM,
  SYNC_DIAGRAM
} from "../constants/action_types";
import {UnBinaryNodeModel} from "../diagram/nodes/UnBinaryNode/UnBinaryNodeModel";
import {ADDPORT, CONSTPORT, INPORT, OUTPORT} from "../diagram/nodes/ConstantNames";
import {ConstantNodeModel} from "../diagram/nodes/ConstantNode/ConstantNodeModel";
import {DefaultLinkModel} from "@projectstorm/react-diagrams-defaults";

function diagramReducer(state, action) {
  switch (action.type) {
    case SET_DIAGRAM:
      state.diagramNodeState.diagramModel = action.diagramModel;
      return state;
    case SYNC_DIAGRAM:
      syncDomain(action.value);
      syncPredicates(action.value);
      syncConstants(action.value);
      return state;
    case ADD_DOMAIN_NODE:
      state.domainNodes.set(action.nodeName,action.nodeObject);
      return state;
    case REMOVE_DOMAIN_NODE:
      state.domainNodes.delete(action.nodeName);
      return state;
    case ADD_CONSTANT_NODE:
      state.constantNodes.set(action.nodeName,action.nodeObject);
      return state;
    case REMOVE_CONSTANT_NODE:
      state.constantNodes.delete(action.nodeName);
      return state;
    default:
      return state;
  }
}

function createNode(nodeObject,nodeName,nameOfSet,diagramModel,app){
  let canvasWidth = app.getDiagramEngine().getCanvas().clientWidth;
  let canvasHeight = app.getDiagramEngine().getCanvas().clientHeight;

  nodeObject.setPosition(Math.random() * (canvasWidth - canvasWidth * 0.1) + canvasWidth * 0.05, Math.random() * (canvasHeight - canvasHeight * 0.1) + canvasHeight * 0.05);
  addNodeState(nodeName, nodeObject, nameOfSet);
  diagramModel.addNode(nodeObject);
}

function createLink(sourcePort,targetPort,diagramModel){
  let link = new DefaultLinkModel();
  link.setSourcePort(sourcePort);
  link.setTargetPort(targetPort);
  diagramModel.addAll(link);
}

function syncConstants(values){
  if(values.structure.constants!== null){
    let constantObjects = new Map(Object.entries(values.structure.constants));
    let constantState = values.diagramNodeState.constantNodes;
    let domainState = values.diagramNodeState.domainNodes;
    let diagramModel = values.diagramNodeState.diagramModel;

    for(let [nodeName,nodeObject] of constantState.entries()) {
      if (!constantObjects.has(nodeName)) {
        removeNodeState(nodeName, constantState);
        removeWholeNode(nodeObject, diagramModel);
      }
    }

    for(let [nodeName,nodeProperties] of constantObjects.entries()) {
      if(!constantState.has(nodeName)) {
        let node = new ConstantNodeModel(nodeName, 'rgb(92,192,125)', {
          "changeDomain":values.changeDomain,
          "addConstantNode":values.addConstantNode,
          "removeConstantNode":values.removeConstantNode
        });
        createNode(node,nodeName,constantState,diagramModel,values.app);
        if(nodeProperties.value.length!==0){
          createLink(node.getPort(CONSTPORT),domainState.get(nodeProperties.value).getPort(INPORT),diagramModel);
        }
      }
      else{
        let nodeObject = constantState.get(nodeName);
        nodeObject.removeAllLinks();
        if(nodeProperties.value.length!==0){
          createLink(nodeObject.getPort(CONSTPORT),domainState.get(nodeProperties.value).getPort(INPORT),diagramModel);
        }
      }
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
  values.diagramNodeState.domainNodes.clear();
  values.diagramNodeState.constantNodes.clear();
  values.diagramNodeState.functionNodes.clear();
}

function clearCertainNodeState(nodeState){
  nodeState.clear();
}

//atm refers all predicates to have unary level
function syncPredicates(values) {
  let predicatesObjects = values.structure.predicates;
  let domainState = values.diagramNodeState.domainNodes;
  let portMap = new Map();

  if (predicatesObjects !== null && Object.keys(predicatesObjects).length > 0) {
    for (let [key, value] of Object.entries(predicatesObjects)) {
      let parsedNodeValues = value.parsed;
      if (parsedNodeValues != null) {
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
        }

        else{

        }
      }

      for (let [currentNodeName, currentNodeObject] of domainState.entries()) {
        if (portMap.has(currentNodeName)) {
          let arrayOfNodeNames = Array.from(portMap.get(currentNodeName));
          arrayOfNodeNames.map((predicatePortName) => {
            let existsPort = currentNodeObject.getPort(predicatePortName);
            if (existsPort === undefined) {
              currentNodeObject.addNewPort(predicatePortName);
            }
          });

          let currentNodePorts = currentNodeObject.getPorts();
          for (let [portName, portObject] of Object.entries(currentNodePorts)) {
            if (!arrayOfNodeNames.includes(portName) && ![ADDPORT, INPORT, OUTPORT].includes(portName)) {
              currentNodeObject.removePort(portObject);
            }
          }
        }
      }
    }
  }
}

function syncDomain(values) {
  let domain = (values.domain);
  let domainState = values.diagramNodeState.domainNodes;
  let diagramModel = values.diagramNodeState.diagramModel;

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

  domain.map(nodeName => {
    if (!existingDomainNodes.includes(nodeName)) {
      let node = new UnBinaryNodeModel(nodeName, 'rgb(92,192,125)', {
        "changeDomain": values.setDomain,
        "setDomain": values.changeDomain,
        "addDomainNode":values.addDomainNode,
        "removeDomainNode":values.removeDomainNode
      });
      createNode(node,nodeName,domainState,diagramModel,values.app);
    }
  });
}

function removeWholeNode(node,diagramModel){
  for(let portObject of Object.values(node.getPorts())){
    node.removePort(portObject); //ensures that all links are deleted
  }
 diagramModel.removeNode(node);
}

export default diagramReducer;