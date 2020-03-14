import {NodeModel, NodeModelGenerics, PortModel} from '@projectstorm/react-diagrams';
import { BasePositionModelOptions } from '@projectstorm/react-canvas-core';
import _ from 'lodash';
import {BinaryPortModel} from "./BinaryPortModel";
import {ADDPORT} from "../../../nodes/ConstantNames";

export interface UnBinaryNodeModelGenerics {
	PORT: BinaryPortModel;
	OPTIONS: UnBinaryNodeModelOptions;
}

export interface UnBinaryNodeModelOptions extends BasePositionModelOptions {
	name?: string;
	color?: string;
	reduxFunctions:any;

}

export class BinaryNodeModel extends NodeModel<NodeModelGenerics & UnBinaryNodeModelGenerics> {
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
			type: 'binaryNodeLabel',
			name: 'Untitled',
			color: 'rgb(92,192,125)',
			...options
		});
		this.addNewPort(ADDPORT);
		this.getPort(ADDPORT).setMaximumLinks(0);
		this.numberOfPorts = 0;
		//this.registerEvents();
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
		let port: BinaryPortModel = new BinaryPortModel((name));
		port.setMaximumLinks(0);
		this.numberOfPorts += 1;
		this.addPort(port);
		return port;
	}

	addPort(port: PortModel): PortModel {
		port.setParent(this);
		this.ports[port.getName()] = port;
		return port;
	}

	remove() {
		super.remove();
		_.forEach(this.ports, port => {
			_.forEach(port.getLinks(), link => {
				link.remove();
			});
		});
	}

	getNodeName(){
		return this.options.name;
	}

	renameNode(name:string){
		this.options.name = name;
	}

	removePort(port: BinaryPortModel): void {
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
