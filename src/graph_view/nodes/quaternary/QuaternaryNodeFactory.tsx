import { QuaternaryNodeWidget } from './QuaternaryNodeWidget';
import { QuaternaryNodeModel } from './QuaternaryNodeModel';
import * as React from 'react';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';

export class QuaternaryNodeFactory extends AbstractReactFactory<QuaternaryNodeModel, DiagramEngine> {
	constructor() {
		super('quaternary');
	}

	generateReactWidget(event:any): JSX.Element {
		return <QuaternaryNodeWidget engine={this.engine} size={50} model={event.model} />;
	}

	generateModel(event:any) {
		return new QuaternaryNodeModel();
	}
}
