import { LinkModel, PortModel, DefaultLinkModel, PortModelAlignment } from '@projectstorm/react-diagrams';

export class TernaryPortModel extends PortModel {
	constructor(alignment: PortModelAlignment) {
		super({
			type: 'ternary',
			name: alignment,
			alignment: alignment
		});
	}

	createLinkModel(): LinkModel {
		return new DefaultLinkModel();
	}
}
