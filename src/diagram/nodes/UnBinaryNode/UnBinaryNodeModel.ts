import {NodeModel, NodeModelGenerics} from '@projectstorm/react-diagrams';
import {UnBinaryPortModel} from './UnBinaryPortModel';
import { BasePositionModelOptions } from '@projectstorm/react-canvas-core';
import _ from 'lodash';
import {ADDPORT} from "../ConstantNames";

export interface UnBinaryNodeModelGenerics {
	PORT: UnBinaryPortModel;
	OPTIONS: UnBinaryNodeModelOptions;
}

export interface UnBinaryNodeModelOptions extends BasePositionModelOptions {
	name?: string;
	color?: string;
	reduxFunctions:any;
}

export class UnBinaryNodeModel extends NodeModel<NodeModelGenerics & UnBinaryNodeModelGenerics> {
	numberOfPorts: number;

	constructor(name: string, color: string,reduxFunctions:any);
	constructor(options?: UnBinaryNodeModelOptions);
	constructor(options: any = {}, color?: string, reduxFunctions?:any) {
		if (typeof options === 'string') {
			options = {
				name: options,
				color: color,
				reduxFunctions:reduxFunctions,
			};
		}
		super({
			type: 'unbinary',
			name: 'Untitled',
			color: 'rgb(92,192,125)',
			...options
		});
		this.addNewPort(ADDPORT);
		this.getPort(ADDPORT).setMaximumLinks(0);
		this.numberOfPorts = 0;
		this.addInOutPort();
		this.registerEvents();
		//if created through DIAGRAM CLICK/DROP -> DISPATCH THIS: MAYBE I SHOULD DISPATCH IT IN CREATENODE FUNCTION NOT HERE
		//setDomain(this.options.name);
	}


	addInOutPort(){
		let port: UnBinaryPortModel = new UnBinaryPortModel("in");
		this.addPort(port);
		port = new UnBinaryPortModel("out");
		this.addPort(port);
	}

	registerEvents(){
		let reduxFunctions = this.options.reduxFunctions;
		let nodeName = this.options.name;
		this.registerListener({
			entityRemoved(event: any): void {
				reduxFunctions["removeDomainNode"](nodeName);
			}
		})
	}

	addNewPort(name: string) {
		//MAYBE EXTRACT FUNCTION IN diagram reducer that checks if port with same name already exists and move it inside UnBinaryNodeModel
		let port: UnBinaryPortModel = new UnBinaryPortModel((name));
		port.setMaximumLinks(0);
		this.numberOfPorts += 1;
		this.addPort(port);
		return port;
	}

	getNodeName(){
		return this.options.name;
	}

	renameNode(name:string){
		this.options.name = name;
	}

	removePort(port: UnBinaryPortModel): void {
		for (let link of _.values(port.getLinks())) {
			link.remove();
		}
		//clear the parent node reference
		if (this.ports[port.getName()]) {
			this.ports[port.getName()].setParent(null);
			delete this.ports[port.getName()];
		}
	}

}
