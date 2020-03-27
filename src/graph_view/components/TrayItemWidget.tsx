import * as React from 'react';
import {Quaternary, Unbinary} from "./TrayItemWidgetIcon";
import styled from "@emotion/styled";

export interface TrayItemWidgetProps {
	model: any;
	color?: string | undefined;
	name: string;
	element:any;
	clickFunction:any;
	reduxProps:any;
}

export const BasicTray = styled.div`
		cursor: pointer;
		width:50%;
		margin:auto;
		margin-bottom:0.5em;
	`;

export class UnbinaryItemWidget extends React.Component<TrayItemWidgetProps> {
	constructor(props:any){
		super(props);
	}

	render() {

		return (
			<BasicTray
				color={this.props.color}
				draggable={true}
				onDragStart={event => {
					event.dataTransfer.setData('storm-graph_view-node', JSON.stringify(this.props.model));
				}}
				onClick={e => {
					this.props.clickFunction(this.props.element,JSON.stringify(this.props.model),this.props.reduxProps);
				}}
				className="tray-item">
				<Unbinary/>
			</BasicTray>
		);
	}
}

export class QuaternaryItemWidget extends React.Component<TrayItemWidgetProps> {
	render() {
		return (
			<BasicTray
				color={this.props.color}
				draggable={true}
				onDragStart={event => {
					event.dataTransfer.setData('storm-graph_view-node', JSON.stringify(this.props.model));
				}}
				onClick={e => {
					this.props.clickFunction(this.props.element,JSON.stringify(this.props.model),this.props.reduxProps);
				}}
				className="tray-item">
				{this.props.name}
			<Quaternary/>
			</BasicTray>

		);
	}
}

