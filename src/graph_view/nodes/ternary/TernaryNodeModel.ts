import { NodeModel, NodeModelGenerics, PortModelAlignment } from '@projectstorm/react-diagrams';
import {TernaryPortModel} from "./TernaryPortModel";

export interface QuaternaryNodeModelGenerics {
	PORT: TernaryPortModel;
}

export class TernaryNodeModel extends NodeModel<NodeModelGenerics & QuaternaryNodeModelGenerics> {
	constructor() {
		super({
			type: 'ternary'
		});
		this.addPort(new TernaryPortModel(PortModelAlignment.TOP));
		this.addPort(new TernaryPortModel(PortModelAlignment.LEFT));
		this.addPort(new TernaryPortModel(PortModelAlignment.RIGHT));
	}
}
