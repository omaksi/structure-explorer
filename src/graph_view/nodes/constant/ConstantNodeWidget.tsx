import * as React from 'react';
import { ConstantNodeModel } from './ConstantNodeModel';
import {DiagramEngine, PortWidget} from '@projectstorm/react-diagrams';
import styled from '@emotion/styled';
import {CONSTANT, UNBINARY} from "../ConstantNames";
import {canUseNameForNode, selectOnlyCurrentGraphElement} from "../functions";

export interface ConstantNodeWidgetProps {
	model: ConstantNodeModel;
	engine: DiagramEngine;
	renameConstantNode:any;
	removeConstantNode:any;
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
		/*background-color: ${p => p.background};*/
		background-color: #a6adbd;
		pointer-events: ${p => p.pointerEvents};
		cursor: ${p => p.cursor};
		border-radius: 50%;
		font-family: sans-serif;
		font-weight:bold;
		color: black;
		border: solid 2px black;
		overflow: hidden;
		font-size: 13px;
		border: solid 2.5px ${p => (p.selected ? 'rgb(0,192,255)' : 'black')};
		justify-items: center;
		text-align:center;
	`;

export const Title = styled.div`
		background: rgba(256, 256, 256, 0.15);
		display: flex;
		white-space: nowrap;
		justify-items: center;
		text-align:center;
	`;

export const TitleName = styled.div`
		flex-grow: 1;
		padding: 10px 10px;
				
		&:hover {
			background: rgba(256, 256, 256, 0.4);
		}
	`;


export class ConstantNodeWidget extends React.Component<ConstantNodeWidgetProps,ConstantNodeWidgetState> {
	constructor(props:ConstantNodeWidgetProps){
		super(props);

		this.state = {
			renameActive: false,
			titleChanged: false,
			nodeName: this.props.model.getOptions().name,
			badName: false
		};
		this.setBadNodeNameState = this.setBadNodeNameState.bind(this);
	}

	cancelRenameNode() {
		this.setState({renameActive: false, nodeName: this.props.model.getNodeName(), badName: false});
		this.props.model.setLocked(false);
	}

	renameNode(nodeName:string) {
		this.props.model.setLocked(false);

		if (nodeName !== this.props.model.getNodeName()) {
			if (!this.state.badName) {
				this.props.renameConstantNode(this.props.model.getNodeName(),nodeName);
				this.props.model.renameNode(nodeName);
			} else {
				this.setState({nodeName: this.props.model.getNodeName()});
			}
		}
		this.setState({nodeName: this.props.model.getNodeName()});
		this.setState({renameActive: false});
		this.setState({badName: false});
	}

	getWidestElement():number{
		let width:number = this.props.model.getNodeName().length;

		if(this.state.renameActive){
			return width;
		}
		return width;
	}

	setBadNodeNameState(bool: boolean) {
		this.setState({badName: bool});
	}

	render() {
		let width = this.getWidestElement();

		return (
			<Node
				data-basic-node-name={this.props.name}
				selected={this.props.model.isSelected()}
				background={this.props.model.getOptions().color}
				pointerEvents={this.props.model.isEditable()?"auto":"none"}
				cursor={this.props.model.isEditable()?"pointer":"move"}
				onClick={() => {
					selectOnlyCurrentGraphElement(this.props.model,this.props.engine);
				}}>
				<Title>
					<PortWidget engine={this.props.engine} port={this.props.model.getMainPort()}>
						<TitleName onDoubleClick={() => {
							if (!this.state.renameActive) {
								this.setState({renameActive: true});
								this.props.model.setLocked(true);
								this.props.engine.getModel().clearSelection();
								this.props.model.setSelected(true);
							}
						}}>
							{!this.state.renameActive ? this.props.model.getNodeName() :
								<input autoFocus onBlur={() => {
									let name = this.state.nodeName.replace(/\s/g, "");
									this.renameNode(name);
								}
								}
									   onKeyDown={(e) => {
										   if (e.key === "Escape") {
											   this.cancelRenameNode();
										   } else if (e.key === "Enter") {
											   let name = this.state.nodeName.replace(/\s/g, "");
											   this.renameNode(name);
										   }
									   }
									   }

									   type="text" style={{
									width: (width+1.5)+"ch",
									height: 20 + "px",
									border: this.state.badName ? "1px solid red" : "1px solid black"
								}} name="" value={this.state.nodeName}
									   onChange={(e) => {
										   this.setState({nodeName: e.target.value});
										   let name = e.target.value.replace(/\s/g, "");
										   canUseNameForNode(this.props.model.getNodeName(),name,this.setBadNodeNameState,this.props.model.getReduxProps(),CONSTANT);
									   }}/>
							}
						</TitleName>
					</PortWidget>
				</Title>
			</Node>)
	}
}
