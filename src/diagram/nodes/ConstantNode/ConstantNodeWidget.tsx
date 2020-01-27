import * as React from 'react';
import { DiagramEngine, PortWidget, PortModel } from '@projectstorm/react-diagrams';
import styled from '@emotion/styled';
import _ from 'lodash';
import { Port } from "./ConstantPortLabelWidget";
import {ConstantNodeModel} from "./ConstantNodeModel";

export interface ConstantNodeWidgetProps {
	node: ConstantNodeModel;
	engine: DiagramEngine;
	name?:string;
	size?: number;
}

export const Node = styled.div<{ background: string; selected: boolean }>`
		background-color: ${p => p.background};
		border-radius: 5px;
		font-family: sans-serif;
		color: white;
		border: solid 2px black;
		overflow: visible;
		font-size: 11px;
		border: solid 2px ${p => (p.selected ? 'rgb(0,192,255)' : 'black')};
	`;

export const Title = styled.div`
		background: rgba(0, 0, 0, 0.3);
		display: flex;
		white-space: nowrap;
		justify-items: center;
	`;

export const TitleName = styled.div`
		flex-grow: 1;
		padding: 5px 5px;
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

export class ConstantNodeWidget extends React.Component<ConstantNodeWidgetProps> {
	generatePort = (port:any) =>{
		if(port.options.name!=="+") {
			return (
				//<ConstantPortLabelWidget engine={this.props.engine} port={port} width={this.props.node.getOptions().name.length*10}/>
				// @ts-ignore
				<PortWidget engine={this.props.engine} port={this.props.node.getPort(port.options.name)}>
					<Port onClick={() => {
						this.props.node.removePort(port);
						this.props.engine.repaintCanvas();
					}
						// @ts-ignore
					} height={20} width={this.props.node.getOptions().name.length * 10}>{port.options.name}</Port>
				</PortWidget>
			)
		}
	};

	render() {
		return (
			<Node
				data-basic-node-name={this.props.name}
				selected={this.props.node.isSelected()}
				// @ts-ignore
				background={this.props.node.getOptions().color}>
				<Title>
					<TitleName>{this.props.node.getOptions().name}</TitleName>
				</Title>
				<Ports>
					<PortsContainer>{_.map(this.props.node.getPorts(), this.generatePort)}
						// @ts-ignore
						<PortWidget engine={this.props.engine} port={this.props.node.getPort("+")}>
							<Port onClick={() => {
								this.props.node.addNewPort(`Port${this.props.node.numberOfPorts}`);
								this.props.engine.repaintCanvas();
							}}
								// @ts-ignore
								  height={20} width={this.props.node.getOptions().name.length * 10}>+</Port>
						</PortWidget>
					</PortsContainer>
				</Ports>
			</Node>)
	}
}
