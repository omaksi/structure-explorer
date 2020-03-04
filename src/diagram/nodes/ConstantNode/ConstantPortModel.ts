import {LinkModel, DefaultLinkModel, PortModelAlignment, PortModel, DiagramEngine} from '@projectstorm/react-diagrams';
import _ from "lodash";
import {ADDPORT} from "../ConstantNames";

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

		/*let link = new DefaultLinkModel();
		this.registerEvents(link);*/
		return new DefaultLinkModel();
		//return link;
	}

	registerEvents(link:LinkModel){
		/*let port = this;
		console.log("registerd");
		link.registerListener({
			targetPortChanged(event: any): void {
				console.log("changed");
				if(link.getTargetPort() == null){
					port.removeLink(link);
				}
			},
			sourcePortChanged(event: any): void {
				console.log(event);
				console.log("target",link.getTargetPort());
				console.log("source",link.getSourcePort());

				if(link.getTargetPort() === null && link.getSourcePort() !== null){
					console.log("yes");
					//port.removeLink(link);
				}
			},
			selectionChanged(event: any): void {
				console.log("select was changed");
			}

		})*/
	}

	canLinkToPort(port: PortModel): boolean {
		if(this.getParent() === port.getParent()){
			return false;
		}

		if(port.getParent().getOptions().type==='constant') {
			this.removeBadLink();
			return false;
		}

		if(port.getName() === ADDPORT){
			this.removeBadLink();
			return false;
		}

		for (let link of _.values(this.getLinks())) {
			if(link.getSourcePort() === this && link.getTargetPort() === port){
				this.removeBadLink();
				return false;
			}
		}
		return true;
	}

	removeBadLink(){
		for (let link of _.values(this.getLinks())) {
			if (link.getSourcePort() !== null && link.getTargetPort() === null) {
				link.remove();
			}
		}
	}


	checkIfExists(link:LinkModel){
		for (let existingLink of _.values(this.getLinks())) {
			if(link.getSourcePort() === existingLink.getSourcePort() && link.getTargetPort() === existingLink.getTargetPort()){
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

		console.log(link.getTargetPort(),link.getSourcePort());

		if(link.getSourcePort()!=null) {
			console.log("A", link.getSourcePort().getNode());
		}

		if(link.getTargetPort()!=null){
			console.log("B",link.getTargetPort().getNode());
		}
	}

}
