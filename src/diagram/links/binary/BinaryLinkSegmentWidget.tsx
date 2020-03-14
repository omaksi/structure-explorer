import * as React from 'react';
import { BinaryLinkFactory } from './BinaryLinkFactory';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';
import { BinaryLinkModel } from './BinaryLinkModel';

export interface BinaryLinkSegmentWidgetProps {
	path: string;
	link: BinaryLinkModel;
	selected: boolean;
	forwardRef: React.RefObject<SVGPathElement>;
	factory: BinaryLinkFactory;
	diagramEngine: DiagramEngine;
	onSelection: (selected: boolean) => any;
	extras: object;
}

export class BinaryLinkSegmentWidget extends React.Component<BinaryLinkSegmentWidgetProps> {
	render() {
		const Bottom = React.cloneElement(
			this.props.factory.generateLinkSegment(
				this.props.link,
				this.props.selected || this.props.link.isSelected(),
				this.props.path
			),
			{
				ref: this.props.forwardRef
			}
		);

		const Top = React.cloneElement(Bottom, {
			strokeLinecap: 'round',
			onMouseLeave: () => {
				this.props.onSelection(false);
			},
			onMouseEnter: () => {
				this.props.onSelection(true);
			},
			...this.props.extras,
			ref: null,
			'data-linkid': this.props.link.getID(),
			strokeOpacity: this.props.selected ? 0.1 : 0,
			strokeWidth: 20,
			fill: 'none',
			onContextMenu: (event:any) => {
				if (!this.props.link.isLocked()) {
					event.preventBinary();
					this.props.link.remove();
				}
			}
		});

		return (
			<g>
				{Bottom}
				{Top}
			</g>
		);
	}
}
