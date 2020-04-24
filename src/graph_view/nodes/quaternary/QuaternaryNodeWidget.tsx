import * as React from 'react';
import { QuaternaryNodeModel } from './QuaternaryNodeModel';
import { DiagramEngine, PortModelAlignment, PortWidget } from '@projectstorm/react-diagrams';
import styled from '@emotion/styled';

export interface QuaternaryNodeWidgetProps {
	model: QuaternaryNodeModel;
	engine: DiagramEngine;
	size?: number;
}
	export const Port = styled.div`
		width: 16px;
		height: 16px;
		z-index: 10;
		background: rgba(0, 0, 0, 0.5);
		border-radius: 8px;
		cursor: pointer;

		&:hover {
			background: rgba(0, 0, 0, 1);
		}
	`;

export const Node = styled.div<{ size: number, pointerEvents: string, cursor:string}>`
	position: 'relative';
	pointer-events: ${p => p.pointerEvents};
	cursor: ${p => p.cursor};
	width: ${p => p.size};
	height: ${p => p.size};
	`;

export class QuaternaryNodeWidget extends React.Component<QuaternaryNodeWidgetProps> {
	render() {

		return (
			<Node size={this.props.size}
				  pointerEvents={this.props.model.isEditable() ? "auto" : "none"}
				  cursor={this.props.model.isEditable() ? "pointer" : "move"}>
				<svg
					width={this.props.size}
					height={this.props.size}
					dangerouslySetInnerHTML={{
						__html:
							`
          <g id="Layer_1">
          </g>
          <g id="Layer_2">
            <polygon fill="rgb(255,255,0)" stroke="${
							this.props.model.isSelected() ? 'rgb(0,192,255)' : '#000000'
						}" stroke-width="2.5" stroke-miterlimit="10" points="10,` +
							this.props.size / 2 +
							` ` +
							this.props.size / 2 +
							`,10 ` +
							(this.props.size - 10) +
							`,` +
							this.props.size / 2 +
							` ` +
							this.props.size / 2 +
							`,` +
							(this.props.size - 10) +
							` "/>
          </g>
        `
					}}
				/>
				<PortWidget
					style={{
						top: this.props.size / 2 - 8,
						left: -8,
						position: 'absolute'
					}}
					port={this.props.model.getPort(PortModelAlignment.LEFT)}
					engine={this.props.engine}>
					<Port />
				</PortWidget>
				<PortWidget
					style={{
						left: this.props.size / 2 - 8,
						top: -8,
						position: 'absolute'
					}}
					port={this.props.model.getPort(PortModelAlignment.TOP)}
					engine={this.props.engine}>
					<Port />
				</PortWidget>
				<PortWidget
					style={{
						left: this.props.size - 8,
						top: this.props.size / 2 - 8,
						position: 'absolute'
					}}
					port={this.props.model.getPort(PortModelAlignment.RIGHT)}
					engine={this.props.engine}>
					<Port />
				</PortWidget>
				<PortWidget
					style={{
						left: this.props.size / 2 - 8,
						top: this.props.size - 8,
						position: 'absolute'
					}}
					port={this.props.model.getPort(PortModelAlignment.BOTTOM)}
					engine={this.props.engine}>
					<Port />
				</PortWidget>
			</Node>
		);
	}
}
