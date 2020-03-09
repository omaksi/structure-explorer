import * as React from 'react';
import { BinaryLabelModel } from './BinaryLabelModel';
import styled from '@emotion/styled';
import { DiagramEngine } from '@projectstorm/react-diagrams';
import {BinaryNodeWidget} from "./binaryNodeLabel/BinaryNodeWidget";
import {BinaryNodeModel} from "./binaryNodeLabel/BinaryNodeModel";

export interface BinaryLabelWidgetProps {
	model: BinaryLabelModel;
	node: BinaryNodeModel;
	engine: DiagramEngine;

}

export const Label = styled.div`
		background: rgba(0, 0, 0, 0.8);
		border-radius: 20px;
		color: white;
		font-size: 28px;
		padding: 12px 16px;
		font-family: sans-serif;
		user-select: none;
	`;

export const Node = styled.div`
width:60px;
height:50px;
		background-color: yellow;
		border-radius: 5px;
		font-family: sans-serif;
		color: black;
		border: solid 2px black;
		overflow: visible;
		font-size: 11px;
		border: solid 2.5px 'black';
	`;

export const Title = styled.div`
		background: rgba(0, 0, 0, 0.3);
		display: flex;
		white-space: nowrap;
		justify-items: center;
		text-align:center;
	`;

export const TitleName = styled.div`
		flex-grow: 1;
		padding: 5px 5px;
				
		&:hover {
			background: #90EE90;
		}
	`;

export const Ports = styled.div`
		display: flex;
		background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.2));
	`;

export const PortsContainer = styled.div`
		flex-grow: 1;
		display: flex;
		flex-direction: column;

		&:first-of-type {
			margin-right: 10px;
		}

		&:only-child {
			margin-right: 0px;
		}
	`;

export class BinaryLabelWidget extends React.Component<BinaryLabelWidgetProps> {
	constructor(props:any) {
		super(props);
	}

	render() {
		return (
			<BinaryNodeWidget node={this.props.node} engine={this.props.engine} setDomain={null} changeDomain={null} removeDomainNode={null}>
			</BinaryNodeWidget>
		)
	}
}
