import { LinkModel, PortModel, DefaultLinkModel, PortModelAlignment } from '@projectstorm/react-diagrams';

export class ConstantPortModel extends PortModel {
	constructor(name: string) {
		super({
			type: 'constant',
			name: name,
			alignment: PortModelAlignment.LEFT
		});
	}

	createLinkModel(): LinkModel {
		return new DefaultLinkModel();
	}
}
