import * as React from 'react';
import styled from "@emotion/styled";
import {Node as UnbinaryNode, Ports as UnbinaryPorts, PortsContainer as UnbinaryPortsContainer, Title as UnbinaryTittle, TitleName as UnbinaryTittleName} from "../nodes/unbinary/UnBinaryNodeWidget";
import {Port as UnbinaryPort} from "../nodes/unbinary/UnBinaryPortLabelWidget";
import {Node as ConstantNode, Title as ConstantTitle, TitleName as ConstantTitleName} from "../nodes/constant/ConstantNodeWidget";
import {Node as QuaternaryNode} from "../nodes/quaternary/QuaternaryNodeWidget";
import {Node as TernaryNode} from "../nodes/ternary/TernaryNodeWidget";

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



