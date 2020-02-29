import {LinkModel, DefaultLinkModel, PortModelAlignment, PortModel, DiagramEngine} from '@projectstorm/react-diagrams';
import _ from "lodash";
import {ADDPORT} from "../ConstantNames";

export class ConstantPortModel extends PortModel {
	constructor(name: string) {
		super({
			type: 'Constant',
			name: name,
			alignment: PortModelAlignment.BOTTOM
		});
	}

	createLinkModel(): LinkModel {
		if (this.getMaximumLinks() === 0) {
			return null;
		}

		return new DefaultLinkModel();
	}

	canLinkToPort(port: PortModel): boolean {
		if(this.getParent() === port.getParent()){
			return false;
		}

		for (let link of _.values(this.getLinks())) {
			if(link.getSourcePort() === this && link.getTargetPort() === port){
				return false;
			}
		}

		return port.getName() !== ADDPORT;
	}

	checkIfExists(link:LinkModel){
		for (let existingLink of _.values(this.getLinks())) {
			if(link.getSourcePort() === existingLink.getSourcePort() && link.getTargetPort() === existingLink.getTargetPort()){
				console.log("it exists");
			}
		}
	}

	addLink(link: LinkModel) {
		/*if(link.getSourcePort()!=null || link.getTargetPort()!=null) {
			if (link.getSourcePort() === link.getTargetPort()) {
				console.log("same");
				this.removeLink(link);
				return;
			}
		}*/


		/*
		}

		//console.log("yeeas we are here");
		if(link.getSourcePort()!=null && link.getTargetPort()!=null){
			for (let existingLink of _.values(this.getLinks())) {
				if(link.getSourcePort() === existingLink.getSourcePort() && link.getTargetPort() === existingLink.getTargetPort()){
					return;
				}
			}
		}*/

		/*if(link.getSourcePort()!=null || link.getTargetPort()!=null) {
			console.log("yes zero");
		}
		if(link.getSourcePort()!=null){
			link.getSourcePort().reportPosition();
		}

		if(link.getTargetPort()!=null){
			link.getTargetPort().reportPosition();
		}*/

		this.links[link.getID()] = link;

		if(link.getSourcePort()!=null) {
			console.log("A", link.getSourcePort().getNode());
		}

		if(link.getTargetPort()!=null){
			console.log("B",link.getTargetPort().getNode());
		}
	}

}
