import * as React from 'react';
import { DiagramEngine, PortModelAlignment, PortWidget } from '@projectstorm/react-diagrams';
import styled from '@emotion/styled';
import { TernaryNodeModel } from './TernaryNodeModel';

export interface QuaternaryNodeWidgetProps {
	node: TernaryNodeModel;
	engine: DiagramEngine;
	size?: number;
}

//vzhlad portu (cierna gulicka)
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

export class TernaryNodeWidget extends React.Component<QuaternaryNodeWidgetProps> {
	render() {
		return (
			<div
				className={'quaternary-node'}
				style={{
					position: 'relative',
					width: this.props.size,
					height: this.props.size
				}}>
				<svg
					width={this.props.size}
					height={this.props.size}
					dangerouslySetInnerHTML={{
						__html:
							`
          <g id="Layer_1">
          </g>
          <g id="Layer_2">
            <polygon fill="rgb(92,192,125)" stroke="${
							this.props.node.isSelected() ? 'rgb(0,192,255)' : '#000000'
						}" stroke-width="2.5" stroke-miterlimit="10" points="5,` +
							this.props.size / 2 +
							` ` +
							this.props.size / 2 +
							`,0 ` +
							(this.props.size) +
							`,` +
							this.props.size / 2 +
							` ` +
							this.props.size / 2 +
							`"/>
          </g>
        `
					}}
				/>
				<PortWidget
					style={{
						top: this.props.size / 2 - 9,
						left: -10,
						position: 'absolute'
					}}
					port={this.props.node.getPort(PortModelAlignment.LEFT)}
					engine={this.props.engine}>
					<Port />
				</PortWidget>
				<PortWidget
					style={{
						left: this.props.size / 2 - 8,
						top: -16,
						position: 'absolute'
					}}
					port={this.props.node.getPort(PortModelAlignment.TOP)}
					engine={this.props.engine}>
					<Port />
				</PortWidget>
				<PortWidget
					style={{
						left: this.props.size - 4,
						top: this.props.size / 2 - 10,
						position: 'absolute'
					}}
					port={this.props.node.getPort(PortModelAlignment.RIGHT)}
					engine={this.props.engine}>
					<Port />
				</PortWidget>

				{/*<PortWidget
					style={{
						left: this.props.size / 2 - 8,
						top: this.props.size - 8,
						position: 'absolute'
					}}
					port={this.props.node.getPort(PortModelAlignment.BOTTOM)}
					engine={this.props.engine}>
					<Port />
				</PortWidget>*/}
			</div>
		);
	}
}
