import { UnBinaryNodeWidget } from './UnBinaryNodeWidget';
import { UnBinaryNodeModel } from './UnBinaryNodeModel';
import * as React from 'react';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';

export class UnBinaryNodeFactory extends AbstractReactFactory<UnBinaryNodeModel, DiagramEngine> {
	constructor() {
		super('unbinary');
	}

	generateReactWidget(event:any): JSX.Element {
		//console.log("mod",event.model);
		return <UnBinaryNodeWidget engine={this.engine} size={50} node={event.model}/>;
	}

	generateModel(event:any) {
		return new UnBinaryNodeModel();
	}
}
