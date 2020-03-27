import {LinkModel, PortModelAlignment, PortModel} from '@projectstorm/react-diagrams';
import _ from "lodash";
import {ADDPORT} from "../ConstantNames";
import {BinaryLinkModel} from "../../links/binary/BinaryLinkModel";


export class UnBinaryPortModel extends PortModel {
	constructor(name: string) {
		super({
			type: 'unbinary',
			name: name,
			alignment: PortModelAlignment.LEFT
		});
	}

	setPortAlignment(alignment:PortModelAlignment){
		this.options.alignment = alignment;
	}

	createLinkModel(): LinkModel {
		if(this.getMaximumLinks()=== 0){
			return null;
		}
		return new BinaryLinkModel();
	}

	removeBadLink(){
		for (let link of _.values(this.getLinks())) {
			if (link.getSourcePort() !== null && link.getTargetPort() === null) {
				link.remove();
			}
		}
	}

	canLinkToPort(port: PortModel): boolean {
		if(port.getName() === ADDPORT){
			return false;
		}

		else if(this.getParent() === port.getParent()){
			if(this!=port){
				return true;
			}
			else{
				this.removeBadLink();
			}
		}

		else if(port.getParent().getOptions().type==='constant') {
			return true;
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

	addLink(link: LinkModel) {
		this.links[link.getID()] = link;
	}

}
