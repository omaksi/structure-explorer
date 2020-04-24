import * as React from 'react';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';
import {TernaryNodeModel} from "./TernaryNodeModel";
import { TernaryNodeWidget } from './TernaryNodeWidget';

export class TernaryNodeFactory extends AbstractReactFactory<TernaryNodeModel, DiagramEngine> {
	constructor() {
		super('ternary');
	}

	generateReactWidget(event:any): JSX.Element {
		return <TernaryNodeWidget engine={this.engine} size={50} model={event.model} />;
	}

	generateModel(event:any) {
		return new TernaryNodeModel();
	}
}
