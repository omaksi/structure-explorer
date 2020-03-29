import { LabelModel} from '@projectstorm/react-diagrams-core';
import { DeserializeEvent } from '@projectstorm/react-canvas-core';
import {BaseModelListener} from '@projectstorm/react-canvas-core';
import { LabelModelOptions, LabelModelGenerics } from '@projectstorm/react-diagrams';
import {UnBinaryNodeModel} from "../../nodes/unbinary/UnBinaryNodeModel";

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
	predicates: Set<string>;
	editable: boolean;
	predicateIndex:number;
	numberOfPredicates: number;

	constructor(options: BinaryLabelModelOptions = {}) {
		super({
			...options,
			offsetY: 0,
			type: 'binary',
		});

		this.predicates = new Set();
		this.editable = true;
		this.predicateIndex = 0;
		this.numberOfPredicates = 0;
	}

	setLabel(label: string) {
		this.options.label = label;
	}

	getPredicates():Set<string>{
		return this.predicates;
	}

	addPredicate(name:string){
		this.predicates.add(name);
		this.predicateIndex+=1;
	}

	removePredicate(name:string){
		if(this.predicates.has(name)){
			this.predicates.delete(name);
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
