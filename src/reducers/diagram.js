import {SET_DIAGRAM, SYNC_DIAGRAM} from "../constants/action_types";
import {UnBinaryNodeModel} from "../diagram/nodes/UnBinaryNode/UnBinaryNodeModel";
import {ADDPORT, INPORT, OUTPORT} from "../diagram/nodes/ConstantNames";

function diagramReducer(state, action) {
  switch (action.type) {
    case SET_DIAGRAM:
      console.log("CALLED");
      return action.diagramModel;
    case SYNC_DIAGRAM:
      console.log("First",action.value.diagramNodeState);
      syncDomain(action.value);
      console.log("after sync Domain",action.value.diagramNodeState);
      syncPredicates(action.value);
      syncConstants(action.value);
      return state;
    default:
      return state;
  }
}

function syncConstants(values){
  let constantsObjects = values.structure.constants;
  console.log("const",constantsObjects);
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

function syncPredicates(values){
  let predicatesObjects = values.structure.predicates;
  //let diagramModel = values.diagramNodeState.diagramModel;
  let domainState = values.diagramNodeState.domainNodes;
  let portMap = new Map();

  if(predicatesObjects !== null && Object.keys(predicatesObjects).length>0) {
    for(let [key,value] of Object.entries(predicatesObjects)){
      console.log("going");
      let parsedNodeValues = value.parsed;
      if(parsedNodeValues!=null){
        let keyWithoutArity = key.split('/')[0];

        parsedNodeValues.map((currentNodeVal)=>{
          let currentNodeValue = currentNodeVal[0];
          if(portMap.has(currentNodeValue)){
            portMap.get(currentNodeValue).add(keyWithoutArity);
          }
          else{
            portMap.set(currentNodeValue,new Set());
            portMap.get(currentNodeValue).add(keyWithoutArity);
          }
        });
      }
    }

    console.log("DOMAINSTATE",domainState);
    //diagramModel.getNodes().map((currentNodeObject)=> {
    for(let [currentNodeName,currentNodeObject] of domainState.entries()){
      console.log("currentNodeObject",currentNodeObject);
      //let currentNodeName = currentNodeObject.getOptions().name;
      if(portMap.has(currentNodeName)){

        let arrayOfNodeNames = Array.from(portMap.get(currentNodeName));

        arrayOfNodeNames.map((predicatePortName) =>{
          let existsPort = currentNodeObject.getPort(predicatePortName);
          if(existsPort === undefined){
            currentNodeObject.addNewPort(predicatePortName);
          }
        });

        //DELETE LINKS TOO
        let currentNodePorts = currentNodeObject.getPorts();
        for(let [portName,portObject] of Object.entries(currentNodePorts)){
          if(!arrayOfNodeNames.includes(portName) && ![ADDPORT,INPORT,OUTPORT].includes(portName)){
            currentNodeObject.removePort(portObject);
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

  let canvasWidth = values.app.getDiagramEngine().getCanvas().clientWidth;
  let canvasHeight = values.app.getDiagramEngine().getCanvas().clientHeight;

  if (domain == null || domain.length === 0) {
    diagramModel.getNodes().map(node => {
      removeWholeNode(node,diagramModel);
    });
    clearDiagramState(values);
    return;
  }

  let existingDomainNodes = [];

  for(let [nodeName,nodeObject] of domainState.entries()){
    if(domain.includes(nodeName)){
      existingDomainNodes.push(nodeName);
    }
    else{
      removeNodeState(nodeName,domainState);
      removeWholeNode(nodeObject,diagramModel);
    }
  }

  domain.map(nodeName => {
    if(!existingDomainNodes.includes(nodeName)){
      let node = new UnBinaryNodeModel(nodeName,'rgb(92,192,125)',{
        "changeDomain": values.setDomain,
        "setDomain": values.changeDomain
      });
      node.setPosition(Math.random()*(canvasWidth-canvasWidth*0.1)+canvasWidth*0.05,Math.random()*(canvasHeight-canvasHeight*0.1)+canvasHeight*0.05);
      addNodeState(nodeName,node,domainState);
      diagramModel.addNode(node);
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