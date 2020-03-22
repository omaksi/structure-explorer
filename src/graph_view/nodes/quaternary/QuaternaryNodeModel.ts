import { NodeModel, NodeModelGenerics, PortModelAlignment } from '@projectstorm/react-diagrams';
import { QuaternaryPortModel } from './QuaternaryPortModel';

export interface QuaternaryNodeModelGenerics {
	PORT: QuaternaryPortModel;
}

export class QuaternaryNodeModel extends NodeModel<NodeModelGenerics & QuaternaryNodeModelGenerics> {
	constructor() {
		super({
			type: 'quaternary'
		});
		this.addPort(new QuaternaryPortModel(PortModelAlignment.TOP));
		this.addPort(new QuaternaryPortModel(PortModelAlignment.LEFT));
		this.addPort(new QuaternaryPortModel(PortModelAlignment.BOTTOM));
		this.addPort(new QuaternaryPortModel(PortModelAlignment.RIGHT));
	}
}
