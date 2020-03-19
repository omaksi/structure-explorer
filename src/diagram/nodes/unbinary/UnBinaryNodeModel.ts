import {NodeModel, NodeModelGenerics, PortModelAlignment} from '@projectstorm/react-diagrams';
import {UnBinaryPortModel} from './UnBinaryPortModel';
import {BasePositionModelOptions} from '@projectstorm/react-canvas-core';
import _ from 'lodash';
import {ADDPORT, INPORT, OUTPORT} from "../ConstantNames";

export interface UnBinaryNodeModelGenerics {
	PORT: UnBinaryPortModel;
	OPTIONS: UnBinaryNodeModelOptions;
}

export interface UnBinaryNodeModelOptions extends BasePositionModelOptions {
	name?: string;
	color?: string;
	reduxFunctions:any;
	domainNodeName:any;
}

export class UnBinaryNodeModel extends NodeModel<NodeModelGenerics & UnBinaryNodeModelGenerics> {
	unaryPredicateIndex: number;
	inPort: UnBinaryPortModel;
	outPort: UnBinaryPortModel;
	appendPort: UnBinaryPortModel;
	unaryPredicates: Set<string>;

	constructor(name: string, color: string, reduxFunctions: any);
	constructor(options?: UnBinaryNodeModelOptions);
	constructor(options: any = {}, color?: string, reduxFunctions?: any) {
		if (typeof options === 'string') {
			options = {
				name: options,
				color: color,
				reduxFunctions: reduxFunctions,
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
		//if created through DIAGRAM CLICK/DROP -> DISPATCH THIS: MAYBE I SHOULD DISPATCH IT IN CREATENODE FUNCTION NOT HERE
		//setDomain(this.options.name);
	}


	addTemplatePorts() {
		let port: UnBinaryPortModel = new UnBinaryPortModel(INPORT);
		port.setPortAlignment(PortModelAlignment.LEFT);
		this.addPort(port);
		this.inPort = port;
		port = new UnBinaryPortModel(OUTPORT);
		port.setPortAlignment(PortModelAlignment.RIGHT);
		this.addPort(port);
		this.outPort = port;
		port = new UnBinaryPortModel(ADDPORT);
		port.setMaximumLinks(0);
		this.addPort(port);
		this.appendPort = port;
	}

	registerEvents() {
		let reduxFunctions = this.options.reduxFunctions;
		let nodeName = this.options.name;
		this.registerListener({
			entityRemoved(event: any): void {
				reduxFunctions["removeDomainNode"](nodeName);
			}
		})
	}

	getUnaryPredicates() {
		return this.unaryPredicates;
	}

	addUnaryPredicate(name: string) {
		if (!this.unaryPredicates.has(name)) {
			this.unaryPredicates.add(name);
			this.options.reduxFunctions["addUnaryPredicate"](name, this.getNodeName());
			this.unaryPredicateIndex++;
		}
	}

	removeUnaryPredicate(name: string) {
		if (this.unaryPredicates.has(name)) {
			this.unaryPredicates.delete(name);
			this.options.reduxFunctions["removeUnaryPredicate"](name, this.getNodeName());
		}
	}

	addNewPort(name: string) {
		//MAYBE EXTRACT FUNCTION IN diagram reducer that checks if port with same name already exists and move it inside UnBinaryNodeModel
		let port: UnBinaryPortModel = new UnBinaryPortModel(name);
		port.setMaximumLinks(0);
		this.addPort(port);
		return port;
	}

	getNodeName() {
		return this.options.name;
	}

	getInPort() {
		return this.inPort;
	}

	getOutPort() {
		return this.outPort;
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
}