import {NodeModel, NodeModelGenerics} from '@projectstorm/react-diagrams';
import {ConstantPortModel} from './ConstantPortModel';
import { BasePositionModelOptions } from '@projectstorm/react-canvas-core';
import _ from 'lodash';
import {CONSTPORT} from "../ConstantNames";
import {BinaryLinkModel} from "../../links/binary/BinaryLinkModel";

export interface ConstantNodeModelGenerics {
	PORT: ConstantPortModel;
	OPTIONS: ConstantNodeModelOptions;
}

export interface ConstantNodeModelOptions extends BasePositionModelOptions {
	name?: string;
	color?: string;
	reduxProps?:any;
}

export class ConstantNodeModel extends NodeModel<NodeModelGenerics & ConstantNodeModelGenerics> {
	mainPort:ConstantPortModel;
	editable:boolean;

	constructor(name: string, color: string,reduxProps:any);
	constructor(options?: ConstantNodeModelOptions);
	constructor(options: any = {}, color?: string, reduxProps?:any) {
		if (typeof options === 'string') {
			options = {
				name: options,
				previousName:options,
				color: color,
				reduxProps:reduxProps
			};
		}
		super({
			type: 'constant',
			name: 'Untitled',
			color: 'rgb(92,192,125)',
			...options
		});

		this.mainPort = this.setUpConstantPort();
		this.editable = reduxProps["editable"];
		this.registerEvents();
	}

	setUpConstantPort(){
		let port: ConstantPortModel = new ConstantPortModel(CONSTPORT);
		this.addPort(port);
		return port;
	}

	removeAllLinks(){
		for (let link of _.values(this.getMainPort().getLinks())) {
			link.remove();
		}
	}

	isEditable():boolean{
		return this.editable;
	}

	changeEditableState(value:boolean){
		this.editable = value;
	}

	setConstantValueInMathView(domainNodeName:string){
		this.options.reduxProps["setConstantValueFromLink"](this.getNodeName(),domainNodeName);
	}

	removeNodeFromMathView(){
		this.options.reduxProps["removeConstantNode"](this.getNodeName());
	}

	registerEvents(){
		let node = this;
		this.registerListener({
			entityRemoved(event: any): void {
				for (let link of _.values(node.getMainPort().getLinks())) {
					if(link instanceof BinaryLinkModel){
						link.setCallReduxFunc(false);
					}
				}
				node.removeNodeFromMathView();
			}
		})
	}

	getMainPort(): ConstantPortModel {
		return this.mainPort;
	}

	getNodeName(){
		return this.options.name;
	}

	renameNode(name:string){
		this.options.name = name;
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

	serialize() {
		return {
			...super.serialize(),
			editable: this.editable
		};
	}

	deserialize(event: any) {
		super.deserialize(event);
		this.editable = event.data.editable;
	}
}
