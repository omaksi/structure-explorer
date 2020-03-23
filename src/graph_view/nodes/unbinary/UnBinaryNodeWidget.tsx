import * as React from 'react';
import { UnBinaryNodeModel } from './UnBinaryNodeModel';
import { DiagramEngine, PortModel, PortWidget } from '@projectstorm/react-diagrams';
import styled from '@emotion/styled';
import _ from 'lodash';
import { Port, PortLabel, PortS } from "./UnBinaryPortLabelWidget";
import {ADDPORT, INPORT, OUTPORT, UNBINARY} from "../ConstantNames";

export interface UnBinaryNodeWidgetProps {
	node: UnBinaryNodeModel;
	engine: DiagramEngine;
	renameDomainNode:any;
	removeDomainNode:any;
	checkBadName:any;
	name?:string;
	size?: number;
}

interface UnBinaryNodeWidgetState {
	renameActive?:boolean;
	titleChanged?:boolean;
	nodeName?:string;
	badName?:boolean;
}

export const Node = styled.div<{ background: string; selected: boolean }>`
		width: 100%;
		background-color: ${p => p.background};
		border-radius: 5px;
		font-family: sans-serif;
		font-weight: bold;
		color: black;
		overflow: visible;
		font-size: 13px;
		border: solid 2px ${p => (p.selected ? 'rgb(0,192,255)' : 'black')};
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
		width: auto;
		display: flex;
		flex-direction: column;
		flex: 1 0 0;
	`;

export const PortsContainerForAddInOut = styled.div`
		display: flex;
		flex-shrink: 0;
		flex-direction: row;
		flex: 1 1 0;
	`;

export class UnBinaryNodeWidget extends React.Component<UnBinaryNodeWidgetProps,UnBinaryNodeWidgetState> {
	constructor(props:UnBinaryNodeWidgetProps){
		super(props);

		this.state={
			renameActive:false,
			titleChanged:false,
			nodeName:this.props.node.getOptions().name,
			badName:false
		};

		this.setBadNameState = this.setBadNameState.bind(this);
	}

	generatePort = (port:any) =>{
		if(![ADDPORT,INPORT,OUTPORT].includes(port.options.name)) {
			return (
				<PortWidget engine={this.props.engine} port={this.props.node.getPort(port.options.name)}>
					<Port onDoubleClick={() => {
						this.props.node.removePort(port);
						this.props.engine.repaintCanvas();
					}} height={20} width={this.props.node.getOptions().name.length * 10}>{port.options.name}</Port>
				</PortWidget>
			)
		}
	};

	generatePredicate = (predicate: string) => {
		return (
			<Port onDoubleClick={() => {
				this.props.node.removeUnaryPredicate(predicate);
				this.forceUpdate();
				//this.props.engine.repaintCanvas();
			}}
				  height={20} width={this.props.node.getOptions().name.length * 10}>
				{predicate}
			</Port>
		)
	};

	cancelRenameNode(){
		this.setState({renameActive:false,nodeName:this.props.node.getNodeName(),badName:false});
		this.props.node.setLocked(false);
	}

	renameNode(){
		this.props.node.setLocked(false);

		if(this.state.nodeName!==this.props.node.getNodeName()){
			if(!this.state.badName){
				this.props.renameDomainNode(this.state.nodeName,this.props.node.getNodeName());
				this.props.node.renameNode(this.state.nodeName);
			}
			else{
				this.setState({nodeName: this.props.node.getNodeName()});
			}
		}
		this.setState({renameActive:false});
		this.setState({badName:false});
	}

	setBadNameState(bool:boolean){
		this.setState({badName:bool});
	}

	render() {
		return (
			<Node
				data-basic-node-name={this.props.name}
				selected={this.props.node.isSelected()}
				background={this.props.node.getOptions().color}
			>
				<Title>
					<TitleName onDoubleClick={() => {
						if (!this.state.renameActive) {
							this.setState({renameActive: true});
							this.props.node.setLocked(true);
						}
					}}>
						{!this.state.renameActive ? this.props.node.getNodeName() :
							<input autoFocus onBlur={() => {
								this.renameNode();
							}
							}
								   onKeyDown={(e) => {
									   if (e.key === "Escape") {
										   this.cancelRenameNode();
									   } else if (e.key === "Enter") {
										   this.renameNode();
									   }
								   }
								   }

								   type="text" style={{
								width: this.props.node.getOptions().name.length * 9 + "px",
								height: 20 + "px",
								border:this.state.badName?"1px solid red":"1px solid black"
							}} name="" value={this.state.nodeName}
								   onChange={(e) => {
								   	this.setState({nodeName: e.target.value});
								   	this.props.checkBadName(e.target.value,this.props.node.getNodeName(),this.setBadNameState,UNBINARY);
								   }}/>
						}
					</TitleName>
				</Title>
			<Ports>
					<PortsContainer>
						{_.map(Array.from(this.props.node.getUnaryPredicates()), this.generatePredicate)}

						<PortsContainerForAddInOut>
							<PortWidget engine={this.props.engine} port={this.props.node.getInPort()}>
								<PortS height={20} width={this.props.node.getOptions().name.length * 20}>{INPORT}</PortS>
							</PortWidget>
							{" | "}
							<PortWidget engine={this.props.engine} port={this.props.node.getAppendPort()}>
								<PortS onClick={() => {
									//this.props.node.addNewPort(`Pred${this.props.node.portIndex}`);
									this.props.node.addUnaryPredicate(`Pred${this.props.node.unaryPredicateIndex}`);
									this.forceUpdate();
									//this.props.engine.repaintCanvas();
								}}
									  height={20} width={this.props.node.getOptions().name.length * 20}>{ADDPORT}</PortS>
							</PortWidget>
							{" | "}
							<PortWidget engine={this.props.engine} port={this.props.node.getOutPort()}>
								<PortS height={20} width={this.props.node.getOptions().name.length * 20}>{OUTPORT}</PortS>
							</PortWidget>
						</PortsContainerForAddInOut>
					</PortsContainer>

				</Ports>
			</Node>)
	}
}
