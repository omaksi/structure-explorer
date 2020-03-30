import { LabelModel} from '@projectstorm/react-diagrams-core';
import { DeserializeEvent } from '@projectstorm/react-canvas-core';
import {BaseModelListener} from '@projectstorm/react-canvas-core';
import { LabelModelOptions, LabelModelGenerics } from '@projectstorm/react-diagrams';

export interface BinaryLabelModelOptions extends LabelModelOptions {
	label?: string;
	predicates?: Set<string>;
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
	predicateIndex:number;
	numberOfPredicates: number;

	constructor(options: BinaryLabelModelOptions = {}) {
		super({
			...options,
			offsetY: 0,
			type: 'binary',
		});

		this.predicates = new Map();
		this.editable = true;
		this.predicateIndex = 0;
		this.numberOfPredicates = 0;
	}

	setLabel(label: string) {
		this.options.label = label;
	}

	getPredicates():Map<string,string>{
		return this.predicates;
	}

	//b - both
	//f - from => means it goes from this node to another (so this node is first parameter)
	//t - to => means it goes to this node from another (so this node is second parameter)
	addPredicate(name:string){
		this.predicates.set(name,"b");
		this.predicateIndex+=1;
	}

	removePredicate(name:string){
		if(this.predicates.has(name)){
			this.predicates.delete(name);
		}
	}

	//going from b -> f -> t
	changeDirectionOfPredicate(name:string,currentDirection:string){
		if(currentDirection === "b"){
			this.predicates.set(name,"f");
		}
		else if(currentDirection === "f"){
			this.predicates.set(name,"t");
		}
		else{
			this.predicates.set(name,"b");
		}
	}

	changeEditableState(value:boolean){
		this.editable = value;
	}

	deserialize(event: DeserializeEvent<this>) {
		super.deserialize(event);
		this.options.label = event.data.label;
		this.editable = event.data.editable;
		this.numberOfPredicates = event.data.numberOfPredicates;
	}

	serialize() {
		return {
			...super.serialize(),
			label: this.options.label,
			editable: this.editable,
			numberOfPredicates: this.predicates.size
		};
	}
}
