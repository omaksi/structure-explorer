import * as React from 'react';
import {Diamond, Unbinary} from "./TrayItemWidgetIcon";
import styled from "@emotion/styled";

export interface TrayItemWidgetProps {
	model: any;
	color?: string | undefined;
	name: string;
	element:any;
	clickFunction:any;
}

export const BasicTray = styled.div`
		cursor: pointer;
	`;

export class UnbinaryItemWidget extends React.Component<TrayItemWidgetProps> {

	render() {

		return (
			<BasicTray
				color={this.props.color}
				draggable={true}
				onDragStart={event => {
					event.dataTransfer.setData('storm-diagram-node', JSON.stringify(this.props.model));
				}}
				onClick={e => {
					this.props.clickFunction(this.props.element,JSON.stringify(this.props.model));
				}}
				className="tray-item">
				<Unbinary/>
			</BasicTray>
		);
	}
}

export class DiamondItemWidget extends React.Component<TrayItemWidgetProps> {

	render() {

		return (
			<BasicTray
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
			</BasicTray>
		);
	}
}

