import * as React from 'react';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';
import {BinaryNodeModel} from "./BinaryNodeModel";
import {BinaryNodeWidget} from "./BinaryNodeWidget";

export class BinaryNodeFactory extends AbstractReactFactory<BinaryNodeModel, DiagramEngine> {
	constructor() {
		super('binaryNodeLabel');
	}

	generateReactWidget(event:any): JSX.Element {
		let reduxFunctions = event.model.options.reduxFunctions;
		return <BinaryNodeWidget removeDomainNode={reduxFunctions["removeDomainNode"]} setDomain={reduxFunctions["setDomain"]} changeDomain={reduxFunctions["changeDomain"]} engine={this.engine} size={50} node={event.model}/>;
	}

	generateModel(event:any) {
		return new BinaryNodeModel();
	}
}
