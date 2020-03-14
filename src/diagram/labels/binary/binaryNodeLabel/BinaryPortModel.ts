import {LinkModel, PortModelAlignment, PortModel} from '@projectstorm/react-diagrams';

export class BinaryPortModel extends PortModel {
	constructor(name: string) {
		super({
			type: 'binaryPortLabel',
			name: name,
			alignment: PortModelAlignment.LEFT
		});
	}

	createLinkModel(): LinkModel {
		return null;
	}

	canLinkToPort(port: PortModel): boolean {
		return false;
	}
}
