import {NodeModel, NodeModelGenerics} from '@projectstorm/react-diagrams';
import {ConstantPortModel} from './ConstantPortModel';
import { BasePositionModelOptions } from '@projectstorm/react-canvas-core';
import _ from 'lodash';
import {ConstantNodeWidget} from "./ConstantNodeWidget";
import * as React from "react";

export interface ConstantNodeModelGenerics {
	PORT: ConstantPortModel;
	OPTIONS: ConstantNodeModelOptions;
}

export interface ConstantNodeModelOptions extends BasePositionModelOptions {
	name?: string;
	previousName?:string;
	color?: string;
	reduxFunctions?:any;
}

export class ConstantNodeModel extends NodeModel<NodeModelGenerics & ConstantNodeModelGenerics> {
	numberOfPorts: number;

	constructor(name: string, color: string,reduxFunctions:any);
	constructor(options?: ConstantNodeModelOptions);
	constructor(options: any = {}, color?: string, reduxFunctions?:any) {
		if (typeof options === 'string') {
			options = {
				name: options,
				previousName:options,
				color: color,
				reduxFunctions:reduxFunctions
			};
		}
		super({
			type: 'constant',
			name: 'Untitled',
			color: 'rgb(92,192,125)',
			...options
		});

		this.numberOfPorts = 0;
		this.addNewPort("*");
		this.options.reduxFunctions["addConstantNode"](this.getNodeName(),this);
		//if created through DIAGRAM CLICK/DROP -> DISPATCH THIS: MAYBE I SHOULD DISPATCH IT IN CREATENODE FUNCTION NOT HERE
		//setDomain(this.options.name);
	}

	addNewPort(name: string) {
		if(this.numberOfPorts === 0){
			let port: ConstantPortModel = new ConstantPortModel((name));
			this.addPort(port);
			this.numberOfPorts+=1;
			return port;
		}
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

	removePort(port: ConstantPortModel): void {
		for (let link of _.values(port.getLinks())) {
			link.remove();
		}
		//clear the parent node reference
		if (this.ports[port.getName()]) {
			this.ports[port.getName()].setParent(null);
			delete this.ports[port.getName()];
		}
		this.options.reduxFunctions["removeConstantNode"](this.getNodeName());
	}


}
