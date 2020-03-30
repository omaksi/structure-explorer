import * as React from 'react';
import { ConstantNodeModel } from './ConstantNodeModel';
import {DiagramEngine, PortWidget} from '@projectstorm/react-diagrams';
import styled from '@emotion/styled';
import {UNBINARY} from "../ConstantNames";

export interface ConstantNodeWidgetProps {
	node: ConstantNodeModel;
	engine: DiagramEngine;
	renameDomainNode:any;
	removeConstantNode:any;
	checkBadName:any;
	name?:string;
	size?: number;
}

interface ConstantNodeWidgetState {
	renameActive?:boolean;
	titleChanged?:boolean;
	nodeName?:string;
	badName?:boolean;
}

export const Node = styled.div<{ background: string; selected: boolean, pointerEvents: string, cursor:string}>`
		background-color: ${p => p.background};
		pointer-events: ${p => p.pointerEvents};
		cursor: ${p => p.cursor};
		border-radius: 50%;
		font-family: sans-serif;
		color: black;
		border: solid 2px black;
		overflow: hidden;
		font-size: 11px;
		border: solid 2.5px ${p => (p.selected ? 'rgb(0,192,255)' : 'black')};
		justify-items: center;
		text-align:center;
	`;

export const Title = styled.div`
		//background: rgba(0, 0, 0, 0.3);
		display: flex;
		white-space: nowrap;
		justify-items: center;
		text-align:center;
	`;

export const TitleName = styled.div`
		flex-grow: 1;
		padding: 10px 10px;
				
		&:hover {
			background: #90EE90;
		}
	`;

export const Ports = styled.div`
		display: flex;
		//background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.2));
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

export const PortR = styled.div`
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

export class ConstantNodeWidget extends React.Component<ConstantNodeWidgetProps,ConstantNodeWidgetState> {
	constructor(props:ConstantNodeWidgetProps){
		super(props);

		this.state = {
			renameActive: false,
			titleChanged: false,
			nodeName: this.props.node.getOptions().name,
			badName: false
		};
		this.setBadNameState = this.setBadNameState.bind(this);
	}

	cancelRenameNode() {
		this.setState({renameActive: false, nodeName: this.props.node.getNodeName(), badName: false});
		this.props.node.setLocked(false);
	}

	renameNode() {
		this.props.node.setLocked(false);

		if (this.state.nodeName !== this.props.node.getNodeName()) {
			if (!this.state.badName) {
				this.props.renameDomainNode(this.state.nodeName, this.props.node.getNodeName());
				this.props.node.renameNode(this.state.nodeName);
			} else {
				this.setState({nodeName: this.props.node.getNodeName()});
			}
		}
		this.setState({renameActive: false});
		this.setState({badName: false});
	}

	setBadNameState(bool: boolean) {
		this.setState({badName: bool});
	}

	render() {
		return (
			<Node
				data-basic-node-name={this.props.name}
				selected={this.props.node.isSelected()}
				background={this.props.node.getOptions().color}
				pointerEvents={this.props.node.isEditable()?"auto":"none"}
				cursor={this.props.node.isEditable()?"pointer":"move"}
			>
				<Title>
					<PortWidget engine={this.props.engine} port={this.props.node.getMainPort()}>
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
									border: this.state.badName ? "1px solid red" : "1px solid black"
								}} name="" value={this.state.nodeName}
									   onChange={(e) => {
										   this.setState({nodeName: e.target.value});
										   this.props.checkBadName(e.target.value, this.props.node.getNodeName(), this.setBadNameState, UNBINARY);
									   }}/>
							}
						</TitleName>
					</PortWidget>
				</Title>
			</Node>)
	}
}
