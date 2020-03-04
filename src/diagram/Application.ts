import { SimplePortFactory } from './nodes/DiamondNode/SimplePortFactory';
import { DiamondPortModel } from './nodes/DiamondNode/DiamondPortModel';
import {DiamondNodeFactory} from "./nodes/DiamondNode/DiamondNodeFactory";
import createEngine,{PortModelAlignment, DiagramModel, DiagramEngine, DefaultDiagramState } from '@projectstorm/react-diagrams';
import {UnBinaryNodeFactory} from "./nodes/UnBinaryNode/UnBinaryNodeFactory";
import {ConstantNodeFactory} from "./nodes/ConstantNode/ConstantNodeFactory";

export class Application {
	protected activeModel: DiagramModel;
	protected diagramEngine: DiagramEngine;

	constructor(diagramModel: DiagramModel) {
		this.diagramEngine = createEngine();
		this.setState();
		this.setModel(diagramModel);

		//Custom ports access
		this.diagramEngine.getPortFactories().registerFactory(new SimplePortFactory('diamond', config => new DiamondPortModel(PortModelAlignment.LEFT)));
		//Custom nodes access
		this.diagramEngine.getNodeFactories().registerFactory(new DiamondNodeFactory());
		this.diagramEngine.getNodeFactories().registerFactory(new UnBinaryNodeFactory());
		this.diagramEngine.getNodeFactories().registerFactory(new ConstantNodeFactory());
	}

	public setState(){
		const state = this.diagramEngine.getStateMachine().getCurrentState();
		if (state instanceof DefaultDiagramState) {
			state.dragNewLink.config.allowLooseLinks = false;
		}
	}
	public setModel(diagramModel: DiagramModel) {
		this.diagramEngine.setModel(diagramModel);
		//set number of links to zero, so if we will select a link it will not create a point
		this.getDiagramEngine().setMaxNumberPointsPerLink(0);
	}

	public getActiveDiagram(): DiagramModel {
		return this.activeModel;
	}

	public getDiagramEngine(): DiagramEngine {
		return this.diagramEngine;
	}
}
