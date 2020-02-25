import {SET_DIAGRAM, SYNC_DIAGRAM} from "../constants/action_types";
import {UnBinaryNodeModel} from "../diagram/nodes/UnBinaryNode/UnBinaryNodeModel";

function diagramReducer(state, action) {
  switch (action.type) {
    case SET_DIAGRAM:
      return action.diagramModel;
    case SYNC_DIAGRAM:
      syncStructure(action.value);
      syncPredicates(action.value);
      return state;
    default:
      return state;
  }
}

function syncPredicates(values){
  let predicatesObjects = values.structure.predicates;
  let diagramModel = values.diagramModel;

  console.log("mode",diagramModel.getNodes());

  if(predicatesObjects !== null && Object.keys(predicatesObjects).length>0) {
    console.log(predicatesObjects);
    for(let [key,value] of Object.entries(predicatesObjects)){
      let parsedNodeValues = value.parsed;
      if(parsedNodeValues!=null){
        let keyWithoutArity = key.split('/')[0];

        parsedNodeValues.map((currentNodeValue)=>{
          console.log(currentNodeValue[0]);
          diagramModel.getNodes().map(currentNode =>{
            if(currentNodeValue[0] === currentNode.getOptions().name){
              currentNode.addNewPort(keyWithoutArity);
            }
          })
        });
      }
    }
  }

  /*predicatesObjects.map((predicateName) =>{
    console.log(predicateName)
  })*/


}

function syncStructure(values) {
  let domain = (values.domain);
  let diagramModel = values.diagramModel;

  let canvasWidth = values.app.getDiagramEngine().getCanvas().clientWidth;
  let canvasHeight = values.app.getDiagramEngine().getCanvas().clientHeight;

  //console.log("prop",values);

  if (domain == null || domain.length === 0) {
   //console.log("IS NULL");
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
 //console.log("ACTUAL DIAGRAM",diagramModel);
}

export default diagramReducer;