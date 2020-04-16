import { LabelModel} from '@projectstorm/react-diagrams-core';
import { DeserializeEvent } from '@projectstorm/react-canvas-core';
import {BaseModelListener} from '@projectstorm/react-canvas-core';
import { LabelModelOptions, LabelModelGenerics } from '@projectstorm/react-diagrams';
import {BOTH, FROM, TO} from "../../nodes/ConstantNames";

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
		this.editable = true;
		this.changeCounter = 0;
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

	setLockedParent(bool:boolean){
		this.getParent().setLocked(bool);
	}

	getReduxProps(){
		return this.getOptions().reduxProps;
	}

	addPredicate(name:string){
		name = name.replace(/\s/g, "");
		if (!this.predicates.has(name)) {
			// @ts-ignore
			this.getReduxProps()["addBinaryPredicate"](name,this.getParent().getSourcePort().getNode().getNodeName(),this.getParent().getTargetPort().getNode().getNodeName(),this.predicates.get(name));
			this.addBinaryPredicateToSet(name);
		}

	}

	addBinaryPredicateToSet(name: string){
		this.predicates.set(name,BOTH);
		this.increaseChangeCounter();
	}

	increaseChangeCounter(){
		this.changeCounter+=1;
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

	isEditable(){
		return this.editable;
	}

	removeBinaryPredicateFromSet(name: string){
		this.predicates.delete(name);
		this.increaseChangeCounter();
	}

	removePredicate(name:string){
		if(this.predicates.has(name)){
			this.removeBinaryPredicateFromSet(name);
			// @ts-ignore
			this.getReduxProps()["removeBinaryPredicate"](name,this.getParent().getSourcePort().getNode().getNodeName(),this.getParent().getTargetPort().getNode().getNodeName(),this.predicates.get(name));
		}
	}

	//going from b -> f -> t
	//b - both
	//f - from => means it goes from this node to another (so this node is first parameter)
	//t - to => means it goes to this node from another (so this node is second parameter)
	changeDirectionOfPredicate(name:string,currentDirection:string){
		if(currentDirection === BOTH){
			this.predicates.set(name,FROM);
		}
		else if(currentDirection === FROM){
			this.predicates.set(name,TO);
		}
		else{
			this.predicates.set(name,BOTH);
		}
		this.increaseChangeCounter();
		// @ts-ignore
		this.getReduxProps()["changeDirectionOfBinaryRelation"](name,this.getParent().getSourcePort().getNode().getNodeName(),this.getParent().getTargetPort().getNode().getNodeName(),this.predicates.get(name));
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
