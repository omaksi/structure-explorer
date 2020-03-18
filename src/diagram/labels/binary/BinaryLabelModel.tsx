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
	predicates: Set<string>;
	predicateIndex:number;

	constructor(options: BinaryLabelModelOptions = {}) {
		super({
			...options,
			offsetY: options.offsetY == null ? 0 : options.offsetY,
			type: 'binary',
			predicates: new Set()
		});

		this.predicates = this.options.predicates;
		this.predicateIndex = 0;
	}

	setLabel(label: string) {
		this.options.label = label;
	}

	getPredicates():Set<string>{
		return this.predicates;
	}

	addPredicate(name:string){
		this.options.locked = !this.options.locked;
		this.predicates.add(name);
		this.predicateIndex+=1;
	}

	removePredicate(name:string){
		if(this.predicates.has(name)){
			this.options.locked = !this.options.locked;
			this.predicates.delete(name);
		}
	}

	deserialize(event: DeserializeEvent<this>) {
		super.deserialize(event);
		this.options.label = event.data.label;
	}

	serialize() {
		return {
			...super.serialize(),
			label: this.options.label
		};
	}
}
