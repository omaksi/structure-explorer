import {NodeModel, NodeModelGenerics, PortModelAlignment} from '@projectstorm/react-diagrams';
import {UnBinaryPortModel} from './UnBinaryPortModel';
import {BasePositionModelOptions} from '@projectstorm/react-canvas-core';
import _ from 'lodash';
import {ADDPORT, MAINPORT} from "../ConstantNames";

export interface UnBinaryNodeModelGenerics {
	PORT: UnBinaryPortModel;
	OPTIONS: UnBinaryNodeModelOptions;
}

export interface UnBinaryNodeModelOptions extends BasePositionModelOptions {
	name?: string;
	color?: string;
	reduxProps:any;
	domainNodeName:any;
}

export class UnBinaryNodeModel extends NodeModel<NodeModelGenerics & UnBinaryNodeModelGenerics> {
	unaryPredicateIndex: number;
	appendPort: UnBinaryPortModel;
	mainPort: UnBinaryPortModel;
	unaryPredicates: Set<string>;

	constructor(name: string, color: string, reduxProps: any);
	constructor(options?: UnBinaryNodeModelOptions);
	constructor(options: any = {}, color?: string, reduxProps?: any) {
		if (typeof options === 'string') {
			options = {
				name: options,
				color: color,
				reduxProps: reduxProps,
			};
		}
		super({
			type: 'unbinary',
			name: 'Untitled',
			color: 'rgb(92,192,125)',
			...options
		});
		this.addTemplatePorts();
		this.registerEvents();
		this.unaryPredicateIndex = 0;
		this.unaryPredicates = new Set();
	}

	getMainPort():UnBinaryPortModel{
		return this.mainPort;
	}


	addTemplatePorts() {
		let port:UnBinaryPortModel = new UnBinaryPortModel(ADDPORT);
		this.appendPort = port;
		port.setMaximumLinks(0);
		this.addPort(port);

		port = new UnBinaryPortModel(MAINPORT);
		port.setPortAlignment(PortModelAlignment.LEFT);
		this.mainPort = port;
		this.addPort(port);
	}

	registerEvents() {
		let reduxProps = this.options.reduxProps;
		let nodeName = this.options.name;
		this.registerListener({
			entityRemoved(event: any): void {
				reduxProps["removeDomainNode"](nodeName);
			}
		})
	}

	clearPredicates(){
		this.unaryPredicates = new Set();
		this.unaryPredicateIndex = 0;
	}

	getUnaryPredicates() {
		return this.unaryPredicates;
	}

	addUnaryPredicateToSet(name: string){
		this.unaryPredicates.add(name);
	}

	addUnaryPredicate(name: string) {
		if (!this.unaryPredicates.has(name)) {
			this.options.reduxProps["addUnaryPredicate"](name, this.getNodeName());
			this.addUnaryPredicateToSet(name);
			this.unaryPredicateIndex++;
		}
	}

	removeUnaryPredicate(name: string) {
		if (this.unaryPredicates.has(name)) {
			this.removeUnaryPredicateFromSet(name);
			this.options.reduxProps["removeUnaryPredicate"](name, this.getNodeName());
		}
	}

	removeUnaryPredicateFromSet(name: string){
		this.unaryPredicates.delete(name);
	}

	addNewPort(name: string) {
		//MAYBE EXTRACT FUNCTION IN graph_view reducer that checks if port with same name already exists and move it inside UnBinaryNodeModel
		let port: UnBinaryPortModel = new UnBinaryPortModel(name);
		port.setMaximumLinks(0);
		this.addPort(port);
		return port;
	}

	getNodeName() {
		return this.options.name;
	}

	getAppendPort() {
		return this.appendPort;
	}

	renameNode(name: string) {
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

	serialize() {
		return {
			...super.serialize(),
			unaryPredicates: this.unaryPredicates,
			unaryPredicateIndex: this.unaryPredicateIndex,
			appendPort: this.appendPort
		};
	}

	deserialize(event: any) {
		super.deserialize(event);
		this.unaryPredicates = event.data.unaryPredicates;
		this.unaryPredicateIndex = event.data.unaryPredicateIndex;
		this.appendPort = event.data.appendPort;
	}
}