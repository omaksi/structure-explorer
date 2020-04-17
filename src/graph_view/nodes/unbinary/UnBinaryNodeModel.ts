import {NodeModel, NodeModelGenerics} from '@projectstorm/react-diagrams';
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
	changeCounter: number;
	unaryPredicates: Set<string>;
	unaryFunctions: Set<string>;
	appendPort: UnBinaryPortModel;
	mainPort: UnBinaryPortModel;
	editable:boolean;

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
		this.changeCounter = 0;
		this.unaryPredicates = new Set();
		this.unaryFunctions = new Set();
		this.editable = reduxProps["editable"];
	}

	addPredicate(name:string){
		this.addUnaryPredicate(name);
	}

	addFunction(name:string){
		this.addUnaryFunction(name);
	}

	getReduxProps(){
		return this.getOptions().reduxProps;
	}

	getAllPredicateNames():Set<string>{
		let predicateSet:Set<string> = new Set();
		let predicates = this.getReduxProps()["store"].getState().language.predicates.parsed;

		if(predicates){
			for(let predicateObject of predicates){
				predicateSet.add(predicateObject.name);
			}
		}
		return predicateSet;
	}

	getPredicates(){
		return this.unaryPredicates;
	}

	getFunctions(){
		return this.unaryFunctions;
	}

	getMainPort():UnBinaryPortModel{
		return this.mainPort;
	}

	isEditable():boolean{
		return this.editable;
	}

	changeEditableState(value:boolean){
		this.editable = value;
	}

	addTemplatePorts() {
		let port:UnBinaryPortModel = new UnBinaryPortModel(ADDPORT);
		this.appendPort = port;
		port.setMaximumLinks(0);
		this.addPort(port);

		port = new UnBinaryPortModel(MAINPORT);
		//port.setPortAlignment(PortModelAlignment.TOP);
		this.mainPort = port;
		this.addPort(port);
	}

	registerEvents() {
		let node = this;
		this.registerListener({
			entityRemoved(): void {
				node.removeNodeFromMathView();
			}
		})
	}

	clearPredicates() {
		this.unaryPredicates = new Set();
		this.increaseChangeCounter();
	}

	getUnaryPredicates() {
		return this.unaryPredicates;
	}

	increaseChangeCounter(){
		this.changeCounter+=1;
	}

	addUnaryPredicateToSet(name: string){
		this.unaryPredicates.add(name);
		this.increaseChangeCounter();
	}

	addUnaryFunctionToSet(name: string){
		this.unaryFunctions.add(name);
		this.increaseChangeCounter();
	}

	addUnaryPredicate(name: string) {
		name = name.replace(/\s/g, "");
		if (!this.unaryPredicates.has(name)) {
			this.getReduxProps()["addUnaryPredicate"](name, this.getNodeName());
			this.addUnaryPredicateToSet(name);
		}
	}

	addUnaryFunction(name: string) {
		name = name.replace(/\s/g, "");
		if (!this.unaryFunctions.has(name)) {
			this.getReduxProps()["addUnaryFunction"](name, this.getNodeName());
			this.addUnaryFunctionToSet(name);
		}
	}

	removeUnaryPredicate(name: string) {
		if (this.unaryPredicates.has(name)) {
			this.removeUnaryPredicateFromSet(name);
			this.getReduxProps()["removeUnaryPredicate"](name, this.getNodeName());
		}
	}

	removeNodeFromMathView(){
		for(let unaryPredicate of this.unaryPredicates){
			this.getReduxProps()["removeUnaryPredicate"](unaryPredicate, this.getNodeName());
		}
		this.getReduxProps()["removeDomainNode"](this.getNodeName());
	}

	removeUnaryPredicateFromSet(name: string){
		this.unaryPredicates.delete(name);
		this.increaseChangeCounter();
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
			changeCounter: this.changeCounter,
			appendPort: this.appendPort,
			editable: this.editable
		};
	}

	deserialize(event: any) {
		super.deserialize(event);
		this.changeCounter = event.date.changeCounter;
		this.appendPort = event.data.appendPort;
		this.editable = event.data.editable;
	}
}