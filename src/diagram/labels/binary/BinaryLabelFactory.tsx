import * as React from 'react';
import { BinaryLabelModel } from './BinaryLabelModel';
import { BinaryLabelWidget } from './BinaryLabelWidget';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';
import {BinaryNodeModel} from "./binaryNodeLabel/BinaryNodeModel";


export class BinaryLabelFactory extends AbstractReactFactory< BinaryLabelModel, DiagramEngine> {
	constructor() {
		super('binary');
	}

	generateReactWidget(event:any): JSX.Element {
		console.log("event",event);
		return <BinaryLabelWidget model={event.model} node={new BinaryNodeModel()} engine={this.engine}/>;
	}

	generateModel(event:any): BinaryLabelModel {
		return new BinaryLabelModel();
	}
}
