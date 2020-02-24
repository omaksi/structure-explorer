import {SET_CONSTANTS, SET_DIAGRAM, SET_PREDICATES, SYNC_DIAGRAM} from "../constants/action_types";
import {UnBinaryNodeModel} from "../diagram/nodes/UnBinaryNode/UnBinaryNodeModel";
import {DiagramModel} from "@projectstorm/react-diagrams-core";

function diagramReducer(state, action) {
  switch (action.type) {
    case SET_DIAGRAM:
      return action.diagramModel;
    case SYNC_DIAGRAM:
      syncDiagram(action.value);
      return state;
    default:
      return state;
  }
}

function syncDiagram(values) {
  let domain = (values.domain);
  let diagramModel = values.diagramModel;

  let canvasWidth = values.app.getDiagramEngine().getCanvas().clientWidth;
  let canvasHeight = values.app.getDiagramEngine().getCanvas().clientHeight;

  console.log("prop",values);

  if (domain == null || domain.length === 0) {
    console.log("IS NULL");
    diagramModel.getNodes().map(node => {
      //TREBA OSETRIT PRE KONSTATNY
      diagramModel.removeNode(node);
    });
    return;
  }

  let nodesNames = [];

 diagramModel.getNodes().map(node => {
   if(domain.includes(node.getOptions().name)){
     nodesNames.push(node.getOptions().name)
   }
   else{
     diagramModel.removeNode(node);
   }
 });

 domain.map(elementName =>{
   if(!nodesNames.includes(elementName)){
     let node = new UnBinaryNodeModel(elementName,'rgb(92,192,125)',values.setDomain,values.changeDomain);
     node.setPosition(Math.random()*(canvasWidth-canvasWidth*0.1)+canvasWidth*0.05,Math.random()*(canvasHeight-canvasHeight*0.1)+canvasHeight*0.05);
     diagramModel.addNode(node);
   }
 });
 console.log("ACTUAL DIAGRAM",diagramModel);
}

export default diagramReducer;