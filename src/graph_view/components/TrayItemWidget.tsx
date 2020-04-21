import * as React from 'react';
import styled from "@emotion/styled";

export interface TrayItemWidgetProps {
	model: any;
	color?: string | undefined;
	name: string;
	element:any;
	clickFunction:any;
	reduxProps:any;
	title:string;
}

export const BasicTray = styled.div`
		cursor: pointer;
		min-width: 2em;
		width:50%;
		margin:auto;
		margin-top:0.5em;
		margin-bottom:0.5em;
	`;

export class ItemWidgetIcon extends React.Component<TrayItemWidgetProps> {
	constructor(props:any){
		super(props);
	}
	render() {
		return (
			<BasicTray
				title={this.props.title}
				color={this.props.color}
				draggable={true}
				onDragStart={event => {
					event.dataTransfer.setData('storm-graph_view-node', JSON.stringify(this.props.model));
				}}
				onClick={e => {
					this.props.clickFunction(this.props.element,JSON.stringify(this.props.model),this.props.reduxProps);
				}}
				className="tray-item">
				{this.props.children}
			</BasicTray>
		);
	}
}



