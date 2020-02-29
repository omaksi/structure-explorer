import {SET_DIAGRAM, SYNC_DIAGRAM} from "../constants/action_types";
import {UnBinaryNodeModel} from "../diagram/nodes/UnBinaryNode/UnBinaryNodeModel";
import {ADDPORT, INPORT, OUTPORT} from "../diagram/nodes/ConstantNames";

function diagramReducer(state, action) {
  switch (action.type) {
    case SET_DIAGRAM:
      console.log("CAAAALAEEED");
      return action.diagramModel;
    case SYNC_DIAGRAM:
      console.log(action);
      syncStructure(action.value);
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

function syncPredicates(values){
  let predicatesObjects = values.structure.predicates;
  let diagramModel = values.diagramNodeState.diagramModel;
  let portMap = new Map();

  if(predicatesObjects !== null && Object.keys(predicatesObjects).length>0) {
    console.log(predicatesObjects);
    for(let [key,value] of Object.entries(predicatesObjects)){
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

    diagramModel.getNodes().map((currentNodeObject)=> {
      let currentNodeName = currentNodeObject.getOptions().name;
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
    });
  }
}

function clearDiagramState(values){
  values.diagramNodeState.domainNodes.clear();
  values.diagramNodeState.constantNodes.clear();
  values.diagramNodeState.functionNodes.clear();
}

function syncStructure(values) {
  console.log("values",values);
  let domain = (values.domain);
  let diagramModel = values.diagramNodeState.diagramModel;

  let canvasWidth = values.app.getDiagramEngine().getCanvas().clientWidth;
  let canvasHeight = values.app.getDiagramEngine().getCanvas().clientHeight;

  //console.log("prop",values);

  if (domain == null || domain.length === 0) {
   //console.log("IS NULL");
    diagramModel.getNodes().map(node => {
      removeWholeNode(node,diagramModel);
      //TREBA OSETRIT PRE KONSTATNY
      //diagramModel.removeNode(node);
    });
    clearDiagramState(values);
    return;
  }

  let nodesNames = [];

 diagramModel.getNodes().map(node => {
   if(domain.includes(node.getOptions().name)){
     nodesNames.push(node.getOptions().name)
   }
   else{
     removeWholeNode(node,diagramModel);
     //diagramModel.removeNode(node);
   }
 });

 domain.map(nodeName =>{
   if(!nodesNames.includes(nodeName)){
     let node = new UnBinaryNodeModel(nodeName,'rgb(92,192,125)',{
       "changeDomain": values.setDomain,
       "setDomain": values.changeDomain,
       "addDomainNode": values.addDomainNode,
       "removeDomainNode": values.removeDomainNode
     });
     node.setPosition(Math.random()*(canvasWidth-canvasWidth*0.1)+canvasWidth*0.05,Math.random()*(canvasHeight-canvasHeight*0.1)+canvasHeight*0.05);
     diagramModel.addNode(node);
     //values.addDomainNode(nodeName,node);
   }
 });
 //console.log("ACTUAL DIAGRAM",diagramModel);
}

function removeWholeNode(node,diagramModel){
  for(let portObject of Object.values(node.getPorts())){
    node.removePort(portObject); //ensures that all links are deleted
  }
  //sync diagramState
  diagramModel.removeNode(node);
}

export default diagramReducer;