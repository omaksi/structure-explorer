import * as React from 'react';
import styled from '@emotion/styled';

export interface TrayItemWidgetProps {
	model: any;
	color?: string;
	name: string;
	element:any;
	clickFunction:any;
}

export const Tray = styled.div<{ color: string }>`
		color: white;
		font-family: Helvetica, Arial;
		padding: 5px;
		margin: 10px 10px;
		border: solid 3px ${p => p.color};
		border-radius: 10px;
		margin-bottom: 2px;
		cursor: pointer;
		text-align:center;
	`;

export class TrayItemWidget extends React.Component<TrayItemWidgetProps> {
	render() {
		return (
			<Tray
				color={this.props.color}
				draggable={true}
				onDragStart={event => {
					event.dataTransfer.setData('storm-diagram-node', JSON.stringify(this.props.model));
				}}
				onClick={e => {
					this.props.clickFunction(this.props.element,JSON.stringify(this.props.model));
				}}
				className="tray-item">
				{this.props.name}
			</Tray>
		);
	}
}
