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
	unaryPredicateIndex: number;
	unaryPredicatesLength: number;
	appendPort: UnBinaryPortModel;
	mainPort: UnBinaryPortModel;
	unaryPredicates: Set<string>;
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
		this.unaryPredicateIndex = 0;
		this.unaryPredicatesLength = 0;
		this.unaryPredicates = new Set();
		this.editable = reduxProps["editable"];
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

	canUsePredicateForGivenArity(predName:string,predArity:string):boolean{
		let predicates = this.getReduxProps()["store"].getState().language.predicates.parsed;

		if(predicates){
			for(let predicateObject of predicates){
				if(predicateObject.name === predName){
					return predicateObject.arity === predArity;
				}
			}
		}
		return true;
	}

	getAvailablePredicatesForGivenArity(arity:string):Set<string>{
		let predicateSet:Set<string> = new Set();
		let predicates = this.getReduxProps()["store"].getState().language.predicates.parsed;

		if(predicates){
			for(let predicateObject of predicates){
				if(predicateObject.arity === arity && !this.unaryPredicates.has(predicateObject.name)){
					predicateSet.add(predicateObject.name);
				}
			}
		}

		return predicateSet;
	}

	getMaximumLengthOfPredicatesForGivenArity(arity:string):number{
		let maxLength = 0;
		let predicates = this.getReduxProps()["store"].getState().language.predicates.parsed;

		if(predicates){
			for(let predicateObject of predicates){
				if(predicateObject.arity === arity && maxLength<predicateObject.name.length){
					maxLength = predicateObject.name.length;
				}
			}
		}
		return maxLength;
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
		name = name.replace(/\s/g, "");
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

	removeNodeFromMathView(){
		for(let unaryPredicate of this.unaryPredicates){
			this.options.reduxProps["removeUnaryPredicate"](unaryPredicate, this.getNodeName());
		}
		this.options.reduxProps["removeDomainNode"](this.getNodeName());
	}

	removeUnaryPredicateFromSet(name: string){
		this.unaryPredicates.delete(name);
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
			unaryPredicatesLength: this.unaryPredicates.size,
			unaryPredicateIndex: this.unaryPredicateIndex,
			appendPort: this.appendPort,
			editable: this.editable
		};
	}

	deserialize(event: any) {
		super.deserialize(event);
		this.unaryPredicatesLength = event.data.unaryPredicatesLength;
		this.unaryPredicateIndex = event.data.unaryPredicateIndex;
		this.appendPort = event.data.appendPort;
		this.editable = event.data.editable;
	}
}