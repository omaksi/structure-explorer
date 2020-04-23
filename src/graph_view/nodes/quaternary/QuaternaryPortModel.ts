import { LinkModel, PortModel, DefaultLinkModel, PortModelAlignment } from '@projectstorm/react-diagrams';
import {BinaryLinkModel} from "../../links/binary/BinaryLinkModel";

export class QuaternaryPortModel extends PortModel {
	constructor(alignment: PortModelAlignment) {
		super({
			type: 'quaternary',
			name: alignment,
			alignment: alignment
		});
	}

	createLinkModel(): LinkModel {
		return new BinaryLinkModel();
	}
}
