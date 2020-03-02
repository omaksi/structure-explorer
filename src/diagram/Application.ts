import * as SRD from '@projectstorm/react-diagrams';
import { SimplePortFactory } from './nodes/DiamondNode/SimplePortFactory';
import { DiamondPortModel } from './nodes/DiamondNode/DiamondPortModel';
import {DiamondNodeFactory} from "./nodes/DiamondNode/DiamondNodeFactory";
import {PortModelAlignment, DiagramModel } from '@projectstorm/react-diagrams';
import {UnBinaryNodeFactory} from "./nodes/UnBinaryNode/UnBinaryNodeFactory";
import {ConstantNodeFactory} from "./nodes/ConstantNode/ConstantNodeFactory";

export class Application {
	protected activeModel: DiagramModel;
	protected diagramEngine: SRD.DiagramEngine;

	constructor(diagramModel: DiagramModel) {
		this.diagramEngine = SRD.default();
		this.newModel(diagramModel);

		//Custom ports access
		this.diagramEngine.getPortFactories().registerFactory(new SimplePortFactory('diamond', config => new DiamondPortModel(PortModelAlignment.LEFT)));
		//Custom nodes access
		this.diagramEngine.getNodeFactories().registerFactory(new DiamondNodeFactory());
		this.diagramEngine.getNodeFactories().registerFactory(new UnBinaryNodeFactory());
		this.diagramEngine.getNodeFactories().registerFactory(new ConstantNodeFactory());
	}

	public newModel(diagramModel: DiagramModel) {
		this.diagramEngine.setModel(diagramModel);
		//set number of links to zero, so if we will select a link it will not create a point
		this.getDiagramEngine().setMaxNumberPointsPerLink(0);
	}

	public getActiveDiagram(): SRD.DiagramModel {
		return this.activeModel;
	}

	public getDiagramEngine(): SRD.DiagramEngine {
		return this.diagramEngine;
	}
}
