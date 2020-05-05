import {LinkModel, PortModelAlignment, PortModel} from '@projectstorm/react-diagrams';
import _ from "lodash";
import {ADDPORT} from "../ConstantNames";
import {BinaryLinkModel} from "../../links/binary/BinaryLinkModel";
import {NaryRelationPortModel} from "../NaryRelationPortModel";

export class ConstantPortModel extends PortModel {
	constructor(name: string) {
		super({
			type: 'constant',
			name: name,
			alignment: PortModelAlignment.BOTTOM
		});
	}

	createLinkModel(): LinkModel {
		if (this.getMaximumLinks() === 0) {
			return null;
		}
		this.getParentCanvasModel().clearSelection();
		return new BinaryLinkModel();
	}

	canLinkToPort(port: PortModel): boolean {
		if(this.getParent() === port.getParent()){
			return false;
		}

		if(port.getParent().getOptions().type==='constant') {
			return false;
		}

		if(port instanceof NaryRelationPortModel){
			return false;
		}

		if(port.getName() === ADDPORT){
			return false;
		}

		for (let link of _.values(this.getLinks())) {
			if(link.getSourcePort() === this && link.getTargetPort() === port){
				return false;
			}
		}
		return true;
	}
}
