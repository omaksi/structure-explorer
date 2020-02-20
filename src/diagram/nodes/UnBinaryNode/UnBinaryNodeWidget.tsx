import * as React from 'react';
import { UnBinaryNodeModel } from './UnBinaryNodeModel';
import { DiagramEngine, PortWidget, PortModel } from '@projectstorm/react-diagrams';
import styled from '@emotion/styled';
import _ from 'lodash';
import { Port } from "./UnBinaryPortLabelWidget";

export interface UnBinaryNodeWidgetProps {
	node: UnBinaryNodeModel;
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
				
		&:hover {
			background: green;
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

export class UnBinaryNodeWidget extends React.Component<UnBinaryNodeWidgetProps> {
	protected renameActive:boolean = false;
	protected titleChanged:boolean = false;


	generatePort = (port:any) =>{
		if(port.options.name!=="+") {
			return (
				//<UnBinaryPortLabelWidget engine={this.props.engine} port={port} width={this.props.node.getOptions().name.length*10}/>
				<PortWidget engine={this.props.engine} port={this.props.node.getPort(port.options.name)}>
					<Port onDoubleClick={() => {
						this.props.node.removePort(port);
						this.props.engine.repaintCanvas();
					}} height={20} width={this.props.node.getOptions().name.length * 10}>{port.options.name}</Port>
				</PortWidget>
			)
		}
	};

	updated = () => {
		this.props.engine.repaintCanvas();
		//console.log("called");
		if(this.titleChanged){


			this.titleChanged = false;
		}
	};

	componentUpdate(prevProps: Readonly<UnBinaryNodeWidgetProps>, prevState: Readonly<{}>, snapshot?: any): void {
		console.log("updateing");
		this.updated();
	}

	render() {
		return (
			<Node
				data-basic-node-name={this.props.name}
				selected={this.props.node.isSelected()}
				background={this.props.node.getOptions().color}>
				<Title>
					<TitleName onDoubleClick={() => {
						this.renameActive = !this.renameActive; //dat to ako state
						this.titleChanged = true;
						this.forceUpdate();
					}}>
						{!this.renameActive ? this.props.node.getOptions().name :
							<input type="text" name="" value={this.props.node.getOptions().name}/>
						}
					</TitleName>
				</Title>
				<Ports>
					<PortsContainer>{_.map(this.props.node.getPorts(), this.generatePort)}
						<PortWidget engine={this.props.engine} port={this.props.node.getPort("+")}>
							<Port onClick={() => {
								this.props.node.addNewPort(`Port${this.props.node.numberOfPorts}`);
								this.props.engine.repaintCanvas();
							}}
								  height={20} width={this.props.node.getOptions().name.length * 10}>+</Port>
						</PortWidget>
					</PortsContainer>
				</Ports>
			</Node>)
	}
}
