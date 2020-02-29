import { ConstantNodeWidget } from './ConstantNodeWidget';
import { ConstantNodeModel } from './ConstantNodeModel';
import * as React from 'react';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';

export class ConstantNodeFactory extends AbstractReactFactory<ConstantNodeModel, DiagramEngine> {
	constructor() {
		super('constant');
	}

	generateReactWidget(event:any): JSX.Element {
		let reduxFunctions = event.model.options.reduxFunctions;
		return <ConstantNodeWidget setDomain={reduxFunctions["setDomain"]} changeDomain={reduxFunctions["changeDomain"]} engine={this.engine} size={50} node={event.model}/>;
	}

	generateModel(event:any) {
		return new ConstantNodeModel();
	}
}
