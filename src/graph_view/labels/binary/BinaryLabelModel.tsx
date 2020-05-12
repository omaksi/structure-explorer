import { LabelModel} from '@projectstorm/react-diagrams-core';
import { DeserializeEvent } from '@projectstorm/react-canvas-core';
import {BaseModelListener} from '@projectstorm/react-canvas-core';
import { LabelModelOptions, LabelModelGenerics } from '@projectstorm/react-diagrams';
import {BOTH, FROM, PREDICATE, TO} from "../../nodes/ConstantNames";
import {functionIsAlreadyDefinedForGivenFunction} from "../../nodes/functions";

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
		this.getFunctions().clear();
	}

	removeLabelFromMathView(){
		for(let [predicateName,direction] of this.predicates.entries()){
			// @ts-ignore
			this.getReduxProps()["removeBinaryPredicate"](predicateName, this.getParent().getSourcePort().getNode().getNodeName(),this.getParent().getTargetPort().getNode().getNodeName(),direction);
		}
		for(let [functionName,direction] of this.functions.entries()){
			// @ts-ignore
			this.getReduxProps()["removeUnaryFunction"](functionName, this.getParent().getSourcePort().getNode().getNodeName(),this.getParent().getTargetPort().getNode().getNodeName(),direction);
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
			let alreadyDefinedInFromDirection = functionIsAlreadyDefinedForGivenFunction(this.getNodeParameters(FROM),this.getFunctionValue(FROM),name+"/1",this.getReduxProps());
			let alreadyDefinedInToDirection = functionIsAlreadyDefinedForGivenFunction(this.getNodeParameters(TO),this.getFunctionValue(TO),name+"/1",this.getReduxProps());

			if(alreadyDefinedInFromDirection){
				this.setLanguageElementDirection(name,TO,this.functions);
			}
			else if(alreadyDefinedInToDirection){
				this.setLanguageElementDirection(name,FROM,this.functions);
			}
			// @ts-ignore
			this.getReduxProps()["addUnaryFunction"](name,this.getParent().getSourcePort().getNode().getNodeName(),this.getParent().getTargetPort().getNode().getNodeName(),this.functions.get(name));
		}
	}

	addBinaryPredicateToSet(name: string){
		this.predicates.set(name,FROM);
		this.increaseChangeCounter();
	}

	addUnaryFunctionToSet(name: string){
		this.functions.set(name,FROM);
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

	changeDirection(name:string,currentDirection:string,givenSet:Map<string,string>){
		if(currentDirection === BOTH){
			givenSet.set(name,FROM);
		}
		else if(currentDirection === FROM){
			givenSet.set(name,TO);
		}
		else{
			givenSet.set(name,BOTH);
		}
	}

	setLanguageElementDirection(name:string,direction:string,givenSet:Map<string,string>){
		givenSet.set(name,direction);
	}

	getNodeParameters(direction:string):[string]{
		if(direction === FROM){
			// @ts-ignore
			return [this.getSourceDomainNode().getNodeName()];
		}
		else if(direction === TO){
			// @ts-ignore
			return [this.getTargetDomainNode().getNodeName()];
		}
		else{
			return null;
		}
	}

	getFunctionValue(direction:string):string{
		if(direction === FROM){
			// @ts-ignore
			return this.getTargetDomainNode().getNodeName();

		}
		else if(direction === TO){
			// @ts-ignore
			return this.getSourceDomainNode().getNodeName();
		}
		else{
			return null;
		}
	}

	//going from b -> f -> t
	//b - both
	//f - from => means it goes from this node to another (so this node is first parameter)
	//t - to => means it goes to this node from another (so this node is second parameter)
	changeDirectionOfBinaryRelation(name:string,currentDirection:string,type:string){
		let givenSet = type === PREDICATE?this.getPredicates():this.getFunctions();

		if(type === PREDICATE){
			this.changeDirection(name,currentDirection,givenSet);
		}
		else{
			let currDirection:string = currentDirection;
			while(true){
				this.changeDirection(name,currDirection,givenSet);
				currDirection = givenSet.get(name);
				if(currDirection === currentDirection){
					this.setLanguageElementDirection(name,currentDirection,givenSet);
					//hint ze nejde zmenit direction
					return;
				}
				let alreadyDefinedForDirection;
				if(currDirection!==BOTH){
					alreadyDefinedForDirection = functionIsAlreadyDefinedForGivenFunction(this.getNodeParameters(currDirection),this.getFunctionValue(currDirection),name+"/1",this.getReduxProps());
				}
				else{
					alreadyDefinedForDirection = functionIsAlreadyDefinedForGivenFunction(this.getNodeParameters(FROM),this.getFunctionValue(FROM),name+"/1",this.getReduxProps()) || functionIsAlreadyDefinedForGivenFunction(this.getNodeParameters(TO),this.getFunctionValue(TO),name+"/1",this.getReduxProps());
				}
				if(!alreadyDefinedForDirection){
					break;
				}
			}
		}
		this.increaseChangeCounter();
		// @ts-ignore
		this.getReduxProps()["changeDirectionOfBinaryRelation"](name,this.getParent().getSourcePort().getNode().getNodeName(),this.getParent().getTargetPort().getNode().getNodeName(),givenSet.get(name),type);
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
