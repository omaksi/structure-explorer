import { LabelModel} from '@projectstorm/react-diagrams-core';
import { DeserializeEvent } from '@projectstorm/react-canvas-core';
import {BaseModelListener} from '@projectstorm/react-canvas-core';
import { LabelModelOptions, LabelModelGenerics } from '@projectstorm/react-diagrams';
import {BOTH, FROM, PREDICATE, TO} from "../../nodes/ConstantNames";

export interface BinaryLabelModelOptions extends LabelModelOptions {
	label?: string;
	predicates?: Set<string>;
	reduxProps?: any;
	name?:string;
}

export interface NodeModelListener extends BaseModelListener {

}

export interface BinaryLabelModelGenerics extends LabelModelGenerics {
	LISTENER: NodeModelListener;
	OPTIONS: BinaryLabelModelOptions;
}

export class BinaryLabelModel extends LabelModel<BinaryLabelModelGenerics> {
	predicates: Map<string,string>;
	functions: Map<string,string>;
	editable: boolean;
	changeCounter: number;

	constructor(options: BinaryLabelModelOptions = {},reduxProps?:any,name?:string) {
		super({
			...options,
			offsetY: 0,
			type: 'binary',
			reduxProps: reduxProps,
			name:name,
		});

		this.predicates = new Map();
		this.functions = new Map();
		this.editable = true;
		this.changeCounter = 0;
		this.registerEvents();
	}

	registerEvents() {
		let label = this;
		this.registerListener({
			entityRemoved(): void {
				label.removeLabelFromMathView();
			}
		})
	}

	getSourceDomainNode(){
		return this.getParent().getSourcePort().getNode();
	}

	getTargetDomainNode(){
		return this.getParent().getTargetPort().getNode();
	}

	getNodeCombinationKey(){
		// @ts-ignore
		return [this.getSourceDomainNode().getNodeName(),this.getTargetDomainNode().getNodeName()].join(",");
	}

	getReversedNodeCombinationKey(){
		// @ts-ignore
		return [this.getTargetDomainNode().getNodeName(),this.getSourceDomainNode().getNodeName()].join(",");
	}

	clearPredicates(){
		this.getPredicates().clear();
	}

	clearFunctions(){
		this.getPredicates().clear();
	}


	removeLabelFromMathView(){
		for(let [predicateName,direction] of this.predicates.entries()){
			// @ts-ignore
			this.getReduxProps()["removeBinaryPredicate"](predicateName, this.getParent().getSourcePort().getNode().getNodeName(),this.getParent().getTargetPort().getNode().getNodeName(),direction);
		}
	}

	setLabel(label: string) {
		this.options.label = label;
	}

	getName():string{
		return this.options.name;
	}

	getPredicates():Map<string,string>{
		return this.predicates;
	}

	getFunctions():Map<string,string>{
		return this.functions;
	}

	setLockedParent(bool:boolean){
		this.getParent().setLocked(bool);
	}

	getReduxProps(){
		return this.getOptions().reduxProps;
	}

	addPredicate(name:string){
		name = name.replace(/\s/g, "");
		if (!this.predicates.has(name)) {
			this.addBinaryPredicateToSet(name);
			// @ts-ignore
			this.getReduxProps()["addBinaryPredicate"](name, this.getParent().getSourcePort().getNode().getNodeName(), this.getParent().getTargetPort().getNode().getNodeName(), this.predicates.get(name));
		}
	}


	addFunction(name:string){
		name = name.replace(/\s/g, "");
		if (!this.functions.has(name)) {
			this.addUnaryFunctionToSet(name);
			// @ts-ignore
			this.getReduxProps()["addUnaryFunction"](name,this.getParent().getSourcePort().getNode().getNodeName(),this.getParent().getTargetPort().getNode().getNodeName(),this.functions.get(name));
		}
	}

	addBinaryPredicateToSet(name: string){
		this.predicates.set(name,BOTH);
		this.increaseChangeCounter();
	}

	addUnaryFunctionToSet(name: string){
		this.functions.set(name,BOTH);
		this.increaseChangeCounter();
	}

	addUnaryFunctionToSetWithDirection(name: string,direction: string){
		this.functions.set(name,direction);
		this.increaseChangeCounter();
	}

	addBinaryPredicateToSetWithDirection(name: string,direction: string){
		this.predicates.set(name,direction);
		this.increaseChangeCounter();
	}

	increaseChangeCounter(){
		this.changeCounter+=1;
	}

	isEditable(){
		return this.editable;
	}

	removeBinaryPredicateFromSet(name: string){
		this.predicates.delete(name);
		this.increaseChangeCounter();
	}

	removeUnaryFunctionFromSet(name: string){
		this.functions.delete(name);
		this.increaseChangeCounter();
	}

	removeFunction(name:string){
		if(this.functions.has(name)){
			// @ts-ignore
			this.getReduxProps()["removeUnaryFunction"](name,this.getParent().getSourcePort().getNode().getNodeName(),this.getParent().getTargetPort().getNode().getNodeName(),this.functions.get(name));
			this.removeUnaryFunctionFromSet(name);
		}
	}

	removePredicate(name:string){
		if(this.predicates.has(name)){
			// @ts-ignore
			this.getReduxProps()["removeBinaryPredicate"](name,this.getParent().getSourcePort().getNode().getNodeName(),this.getParent().getTargetPort().getNode().getNodeName(),this.predicates.get(name));
			this.removeBinaryPredicateFromSet(name);
		}
	}

	//going from b -> f -> t
	//b - both
	//f - from => means it goes from this node to another (so this node is first parameter)
	//t - to => means it goes to this node from another (so this node is second parameter)
	changeDirectionOfBinaryRelation(name:string,currentDirection:string,type:string){
		let givenSet = type === PREDICATE?this.predicates:this.functions;
		if(currentDirection === BOTH){
			givenSet.set(name,FROM);
		}
		else if(currentDirection === FROM){
			givenSet.set(name,TO);
		}
		else{
			givenSet.set(name,BOTH);
		}
		this.increaseChangeCounter();
		// @ts-ignore
		this.getReduxProps()["changeDirectionOfBinaryRelation"](name,this.getParent().getSourcePort().getNode().getNodeName(),this.getParent().getTargetPort().getNode().getNodeName(),this.predicates.get(name),type);
	}

	changeEditableState(value:boolean){
		this.editable = value;
	}

	deserialize(event: DeserializeEvent<this>) {
		super.deserialize(event);
		this.options.label = event.data.label;
		this.editable = event.data.editable;
		this.changeCounter = event.data.changeCounter;
	}

	serialize() {
		return {
			...super.serialize(),
			label: this.options.label,
			editable: this.editable,
			changeCounter: this.changeCounter
		};
	}
}
