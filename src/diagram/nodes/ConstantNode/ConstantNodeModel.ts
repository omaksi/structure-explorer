import {NodeModel, NodeModelGenerics} from '@projectstorm/react-diagrams';
import {ConstantPortModel} from './ConstantPortModel';
import { BasePositionModelOptions } from '@projectstorm/react-canvas-core';
import _ from 'lodash';
import {PortModel} from "@projectstorm/react-diagrams-core/dist/@types/src/entities/port/PortModel";
import {CONSTPORT} from "../ConstantNames";

export interface ConstantNodeModelGenerics {
	PORT: ConstantPortModel;
	OPTIONS: ConstantNodeModelOptions;
}

export interface ConstantNodeModelOptions extends BasePositionModelOptions {
	name?: string;
	color?: string;
	reduxFunctions?:any;
}

export class ConstantNodeModel extends NodeModel<NodeModelGenerics & ConstantNodeModelGenerics> {
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

		this.addNewPort("*");
		this.registerEvents();
	}

	registerEvents(){
		let reduxFunctions = this.options.reduxFunctions;
		let nodeName = this.options.name;
		this.registerListener({
			entityRemoved(event: any): void {
				reduxFunctions["removeConstantNode"](nodeName);
			}
		})
	}

	getPort(name: string): PortModel | null {
		for(let [nodeName,nodeObject] of Object.entries(this.getPorts())){
			if(name === nodeName){
				return nodeObject;
			}
		}
		return null;
	}

	addNewPort(name: string) {
			let port: ConstantPortModel = new ConstantPortModel((name));
			port.setMaximumLinks(1);
			this.addPort(port);
			return port;
		}

	getNodeName(){
		return this.options.name;
	}

	renameNode(name:string){
		this.options.name = name;
	}

	removeAllLinks(){
		for (let link of _.values(this.getPort(CONSTPORT).getLinks())) {
			link.remove();
		}
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
	}


}
