import { LabelModel} from '@projectstorm/react-diagrams-core';
import { DeserializeEvent } from '@projectstorm/react-canvas-core';
import {BinaryNodeModel} from "./binaryNodeLabel/BinaryNodeModel";
import {BaseModelListener} from '@projectstorm/react-canvas-core';
import { LabelModelOptions, LabelModelGenerics } from '@projectstorm/react-diagrams';

export interface BinaryLabelModelOptions extends LabelModelOptions {
	label?: string;
}

export interface NodeModelListener extends BaseModelListener {

}

export interface BinaryLabelModelGenerics extends LabelModelGenerics {
	LISTENER: NodeModelListener;
	OPTIONS: BinaryLabelModelOptions;
}

export class BinaryLabelModel extends LabelModel<BinaryLabelModelGenerics> {
	node:BinaryNodeModel;
	forceLinkFunction:any;


	constructor(options: BinaryLabelModelOptions = {}) {
		super({
			...options,
			offsetY: options.offsetY == null ? -23 : options.offsetY,
			type: 'binary',
		});
		this.setNewNode();
	}

	setLabel(label: string) {
		this.options.label = label;
	}

	setNewNode(){
		this.node = new BinaryNodeModel();
	}

	addNewPort(name:string){
		this.node.addNewPort(name);
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
