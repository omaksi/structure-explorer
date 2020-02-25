import {NodeModel, NodeModelGenerics} from '@projectstorm/react-diagrams';
import {UnBinaryPortModel} from './UnBinaryPortModel';
import { BasePositionModelOptions } from '@projectstorm/react-canvas-core';
import _ from 'lodash';

export interface UnBinaryNodeModelGenerics {
	PORT: UnBinaryPortModel;
	OPTIONS: UnBinaryNodeModelOptions;
}

export interface UnBinaryNodeModelOptions extends BasePositionModelOptions {
	name?: string;
	previousName?:string;
	color?: string;
	setDomain?:any;
	changeDomain?:any;
}

export class UnBinaryNodeModel extends NodeModel<NodeModelGenerics & UnBinaryNodeModelGenerics> {
	numberOfPorts: number;

	constructor(name: string, color: string,setDomain:any,changeDomain:any);
	constructor(options?: UnBinaryNodeModelOptions);
	constructor(options: any = {}, color?: string, setDomain?:any, changeDomain?:any) {
		if (typeof options === 'string') {
			options = {
				name: options,
				previousName:options,
				color: color,
				setDomain:setDomain,
				changeDomain:changeDomain
			};
		}
		super({
			type: 'unbinary',
			name: 'Untitled',
			color: 'rgb(92,192,125)',
			...options
		});
		this.addNewPort("+");
		this.getPort("+").setMaximumLinks(0);
		this.numberOfPorts = 0;


		//if created through DIAGRAM CLICK/DROP -> DISPATCH THIS: MAYBE I SHOULD DISPATCH IT IN CREATENODE FUNCTION NOT HERE
		//setDomain(this.options.name);
	}

	addNewPort(name: string) {
		let port: UnBinaryPortModel = new UnBinaryPortModel((name));
		port.setMaximumLinks(0);
		this.numberOfPorts += 1;
		this.addPort(port);
		return port;
	}


	getNodeName(){
		return this.options.name;
	}

	getPreviousNodeName(){
		return this.options.previousName;
	}

	renameNode(name:string){
		this.options.name = name;
	}

	renamePreviousNode(name:string){
		this.options.previousName = name;
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
		this.numberOfPorts -= 1;
	}

}
