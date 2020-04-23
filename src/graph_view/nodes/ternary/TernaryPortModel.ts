import { LinkModel, PortModel, PortModelAlignment } from '@projectstorm/react-diagrams';
import {BinaryLinkModel} from "../../links/binary/BinaryLinkModel";

export class TernaryPortModel extends PortModel {
	constructor(alignment: PortModelAlignment) {
		super({
			type: 'ternary',
			name: alignment,
			alignment: alignment
		});
	}

	createLinkModel(): LinkModel {
		return new BinaryLinkModel();
	}
}
