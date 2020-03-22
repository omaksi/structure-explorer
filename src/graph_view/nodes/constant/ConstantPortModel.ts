import {LinkModel, DefaultLinkModel, PortModelAlignment, PortModel, DiagramEngine} from '@projectstorm/react-diagrams';
import _ from "lodash";
import {ADDPORT} from "../ConstantNames";
import {BinaryLinkModel} from "../../links/binary/BinaryLinkModel";

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
		return new BinaryLinkModel();
	}

	canLinkToPort(port: PortModel): boolean {
		if(this.getParent() === port.getParent()){
			return false;
		}

		if(port.getParent().getOptions().type==='constant') {
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

	checkIfExists(link:LinkModel){
		for (let existingLink of _.values(this.getLinks())) {
			if(link.getSourcePort() === existingLink.getSourcePort() && link.getTargetPort() === existingLink.getTargetPort()){
			}
		}
	}

	/*addLink(link: LinkModel) {
		this.links[link.getID()] = link;
	}*/

}
