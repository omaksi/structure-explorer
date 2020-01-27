
import * as React from 'react';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';
import { ConstantNodeWidget } from './ConstantNodeWidget';
import { ConstantNodeModel } from './ConstantNodeModel';

export class ConstantNodeFactory extends AbstractReactFactory<ConstantNodeModel, DiagramEngine> {
	constructor() {
		super('constant');
	}

	generateReactWidget(event:any): JSX.Element {
		return <ConstantNodeWidget engine={this.engine} size={50} node={event.model}/>;
	}

	generateModel(event:any) {
		return new ConstantNodeModel();
	}
}
