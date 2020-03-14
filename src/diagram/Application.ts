import { DiamondPortModel } from './nodes/diamond/DiamondPortModel';
import {DiamondNodeFactory} from "./nodes/diamond/DiamondNodeFactory";
import createEngine,{PortModelAlignment, DiagramModel, DiagramEngine, DefaultDiagramState } from '@projectstorm/react-diagrams';
import {UnBinaryNodeFactory} from "./nodes/unbinary/UnBinaryNodeFactory";
import {ConstantNodeFactory} from "./nodes/constant/ConstantNodeFactory";
import {BinaryLabelFactory} from "./labels/binary/BinaryLabelFactory";
import { SimplePortFactory } from './nodes/SimplePortFactory';
import {BinaryLinkFactory} from "./links/binary/BinaryLinkFactory";

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
		//Custom link access
		this.diagramEngine.getLinkFactories().registerFactory(new BinaryLinkFactory());
		//Custom labels access
		this.diagramEngine.getLabelFactories().registerFactory(new BinaryLabelFactory());
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
