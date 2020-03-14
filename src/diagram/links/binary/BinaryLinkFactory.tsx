import * as React from 'react';
import { BinaryLinkModel } from './BinaryLinkModel';
import { BinaryLinkWidget } from './BinaryLinkWidget';
import styled from '@emotion/styled';
import { css, keyframes } from '@emotion/core';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';

	export const Keyframes = keyframes`
		from {
			stroke-dashoffset: 24;
		}
		to {
			stroke-dashoffset: 0;
		}
	`;

	const selected = css`
		stroke-dasharray: 10, 2;
		animation: ${Keyframes} 1s linear infinite;
	`;

	export const Path = styled.path<{ selected: boolean }>`
		${p => p.selected && selected};
		fill: none;
		pointer-events: all;
	`;

export class BinaryLinkFactory<Link extends BinaryLinkModel = BinaryLinkModel> extends AbstractReactFactory<
	Link,
	DiagramEngine
> {
	constructor(type = 'binary') {
		super(type);
	}

	generateReactWidget(event:any): JSX.Element {
		return <BinaryLinkWidget link={event.model} diagramEngine={this.engine} />;
	}

	generateModel(event:any): Link {
		return new BinaryLinkModel() as Link;
	}

	generateLinkSegment(model: Link, selected: boolean, path: string) {
		return (
			<Path
				selected={selected}
				stroke={selected ? model.getOptions().selectedColor : model.getOptions().color}
				strokeWidth={model.getOptions().width}
				d={path}
			/>
		);
	}
}
