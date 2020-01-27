import * as SRD from '@projectstorm/react-diagrams';
import {DiamondNodeModel} from "./nodes/DiamondNode/DiamondNodeModel";
import { SimplePortFactory } from './nodes/DiamondNode/SimplePortFactory';
import { DiamondPortModel } from './nodes/DiamondNode/DiamondPortModel';
import {DiamondNodeFactory} from "./nodes/DiamondNode/DiamondNodeFactory";
import {PortModelAlignment, DiagramModel } from '@projectstorm/react-diagrams';
import {UnBinaryNodeFactory} from "./nodes/UnBinaryNode/UnBinaryNodeFactory";
import {UnBinaryNodeModel} from "./nodes/UnBinaryNode/UnBinaryNodeModel";

export class Application {
	protected activeModel: DiagramModel;
	protected diagramEngine: SRD.DiagramEngine;

	constructor(diagramModel:DiagramModel) {
		this.diagramEngine = SRD.default();
		this.newModel(diagramModel);

		this.diagramEngine
			.getPortFactories()
			.registerFactory(new SimplePortFactory('diamond', config => new DiamondPortModel(PortModelAlignment.LEFT)));

		//Custom nodes access
		this.diagramEngine.getNodeFactories().registerFactory(new DiamondNodeFactory());

		this.diagramEngine.getNodeFactories().registerFactory(new UnBinaryNodeFactory());
	}


	public newModel(diagramModel:DiagramModel) {
		/*this.activeModel = new SRD.DiagramModel();
		this.diagramEngine.setModel(this.activeModel);*/

		this.diagramEngine.setModel(diagramModel);

		/*
		//3-A) create a default node
		var node1 = new SRD.DefaultNodeModel('Node 1', 'rgb(0,192,255)');
		let port = node1.addOutPort('Out');
		let port3 = node1.addInPort('In');
		node1.setPosition(100, 100);

		//3-B) create another default node
		var node2 = new SRD.DefaultNodeModel('Node 2', 'rgb(192,255,0)');
		let port2 = node2.addInPort('In');
		node2.setPosition(400, 100);



		var node3 = new DiamondNodeModel();
		node3.setPosition(500,300);
		// link the ports
		let link1 = port.link(port2);

		var node4 = new UnBinaryNodeModel('Node 5', 'rgb(192,255,243)');
		let port5 = node4.addNewPort("New One");
		node4.setPosition(450,150);

		this.activeModel.addAll(node1, node2,node3,node4, link1);
		 */


		this.getDiagramEngine().setMaxNumberPointsPerLink(0); //aby fungoval hned select linkov a nevytvaraju sa body
	}

	public getActiveDiagram(): SRD.DiagramModel {
		return this.activeModel;
	}

	public getDiagramEngine(): SRD.DiagramEngine {
		return this.diagramEngine;
	}
}
