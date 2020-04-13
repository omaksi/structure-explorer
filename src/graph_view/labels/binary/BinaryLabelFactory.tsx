import * as React from 'react';
import { BinaryLabelModel } from './BinaryLabelModel';
import { BinaryLabelWidget } from './BinaryLabelWidget';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';

export class BinaryLabelFactory extends AbstractReactFactory< BinaryLabelModel, DiagramEngine> {
	constructor() {
		super('binary');
	}

	generateReactWidget(event:any): JSX.Element {
		return <BinaryLabelWidget model={event.model} engine={this.engine}/>;
	}

	generateModel(event:any): BinaryLabelModel {
		console.log("event",event);
		return new BinaryLabelModel();
	}
}
