import { LabelModel, LabelModelGenerics, LabelModelOptions } from '@projectstorm/react-diagrams-core';
import { DeserializeEvent } from '@projectstorm/react-canvas-core';
import {BinaryNodeModel} from "./binaryNodeLabel/BinaryNodeModel";

export interface BinaryLabelModelOptions extends LabelModelOptions {
	label?: string;
}

export interface BinaryLabelModelGenerics extends LabelModelGenerics {
	OPTIONS: BinaryLabelModelOptions;
}

export class BinaryLabelModel extends LabelModel<BinaryLabelModelGenerics> {
	node:BinaryNodeModel;

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
