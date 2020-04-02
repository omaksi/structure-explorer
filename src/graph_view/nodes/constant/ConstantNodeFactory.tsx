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
		let reduxProps = event.model.options.reduxProps;
		return <ConstantNodeWidget checkBadName={reduxProps["checkBadName"]} removeConstantNode={reduxProps["removeConstantNode"]} renameConstantNode={reduxProps["renameConstantNode"]} engine={this.engine} size={50} node={event.model}/>;
	}

	generateModel(event:any) {
		return new ConstantNodeModel();
	}
}
