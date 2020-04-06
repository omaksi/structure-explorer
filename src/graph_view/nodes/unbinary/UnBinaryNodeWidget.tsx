import * as React from 'react';
import { UnBinaryNodeModel } from './UnBinaryNodeModel';
import { DiagramEngine, PortWidget } from '@projectstorm/react-diagrams';
import styled from '@emotion/styled';
import _ from 'lodash';
import { Port } from "./UnBinaryPortLabelWidget";
import {ADDPORT, ADDPORTSELECTED, CONSTANT, UNBINARY} from "../ConstantNames";
import FontAwesome from "react-fontawesome";
import {Predicate, PredicateButton, PredicateRowContainer} from "../../labels/binary/BinaryLabelWidget";
import {UnBinarySelectWidget} from "./UnBinarySelectWidget";

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
	predicateDropDownMenu?:boolean;
}

export const Node = styled.div<{ background: string; selected: boolean, pointerEvents: string, cursor:string}>`
		width: 100%;
		pointer-events: ${p => p.pointerEvents};
		cursor: ${p => p.cursor};
		/*background-color: ${p => p.background};*/
		background-color: green;
		border-radius: 5px;
		font-family: sans-serif;
		font-weight: bold;
		color: black;
		overflow: visible;
		font-size: 13px;
		border: solid 2px ${p => (p.selected ? 'rgb(0,192,255)' : 'black')};
	`;

export const DropDownNode = styled.div<{ background: string; selected: boolean, pointerEvents: string, cursor:string}>`
		width: 100%;
		pointer-events: ${p => p.pointerEvents};
		cursor: ${p => p.cursor};
		/*background-color: ${p => p.background};*/
		background-color: green;
		border-radius: 5px;
		font-family: sans-serif;
		font-weight: bold;
		color: black;
		overflow: visible;
		font-size: 13px;
		border: solid 2px black;
	`;

export const Title = styled.div`
		width: 100%;
		background: rgba(256, 256, 256, 0.35);
		display: flex;
		white-space: nowrap;
		justify-items: center;
		text-align:center;
	`;

export const TitleName = styled.div`
		width: 100%;
		flex-grow: 1;
		padding: 5px 5px;
				
		&:hover {
			background: rgba(256, 256, 256, 0.4);
		}
	`;

export const Ports = styled.div`
		display: flex;
		background-image: linear-gradient(rgba(256, 256, 256, 0.45), rgba(256, 256, 256, 0.55));
	`;

export const PortsContainer = styled.div`
		width: auto;
		display: flex;
		flex-direction: column;
		flex: 1 0 0;
	`;

export const PredicateRemoveButton = styled.div`
		outline: none;
		cursor: pointer;
		height: 20px;
		background: rgba(white, 0.1);
		color: black;
		text-align:center;
		padding-left:0.2em;
		padding-right:0.2em;
		
		&:hover {
			background: #00ff80;
		}
	`;

export class UnBinaryNodeWidget extends React.Component<UnBinaryNodeWidgetProps,UnBinaryNodeWidgetState> {
	_isMounted:boolean = false;

	constructor(props: UnBinaryNodeWidgetProps) {
		super(props);

		this.state = {
			renameActive: false,
			titleChanged: false,
			nodeName: this.props.node.getOptions().name,
			badName: false,
			predicateDropDownMenu: false
		};
		this.setBadNameState = this.setBadNameState.bind(this);
	}

	componentWillUnmount(): void {
		this._isMounted = false;

	}

	componentDidMount(): void {
		this._isMounted = true;

	}

	generatePredicate = (predicate: string) => {
		return (

			<PredicateRowContainer key={predicate} >
				<Predicate>
					{predicate}
				</Predicate>
				<PredicateRemoveButton onClick={() =>{
					this.props.node.removeUnaryPredicate(predicate);
					this.props.engine.repaintCanvas();
				}}><FontAwesome name={"fas fa-trash"}/></PredicateRemoveButton>
			</PredicateRowContainer>
		)
	};

	generateAvailablePredicate = (predicate: string) => {
		return (

			<PredicateRowContainer key={predicate} >
				<Predicate>
					{predicate}
				</Predicate>
				<PredicateRemoveButton onClick={() =>{
					this.props.node.addUnaryPredicate(predicate);
					this.props.engine.repaintCanvas();
				}}><FontAwesome name={"fas fa-plus"}/></PredicateRemoveButton>
			</PredicateRowContainer>
		)
	};

	cancelRenameNode() {
		if(!this._isMounted){
			return;
		}
		this.setState({renameActive: false, nodeName: this.props.node.getNodeName(), badName: false});
		this.props.node.setLocked(false);
	}

	renameNode() {
		if(!this._isMounted){
			return;
		}
		this.props.node.setLocked(false);

		if (this.state.nodeName !== this.props.node.getNodeName()) {
			if (!this.state.badName) {
				this.props.renameDomainNode(this.props.node.getNodeName(),this.state.nodeName);
				this.props.node.renameNode(this.state.nodeName);
			} else {
				this.setState({nodeName: this.props.node.getNodeName()});
			}
		}
		this.setState({renameActive: false});
		this.setState({badName: false});
	}

	setBadNameState(bool: boolean) {
		if(!this._isMounted){
			return;
		}

		this.setState({badName: bool});
	}

	render() {
		return (
			<div>
			<Node
				data-basic-node-name={this.props.name}
				selected={this.props.node.isSelected()}
				background={this.props.node.getOptions().color}
				pointerEvents={this.props.node.isEditable()?"auto":"none"}
				cursor={this.props.node.isEditable()?"pointer":"move"}
			>
				<Title>
					<PortWidget style={{flexGrow: 1}} engine={this.props.engine} port={this.props.node.getMainPort()}>
						<TitleName onDoubleClick={() => {
							if (!this.state.renameActive  && this._isMounted) {
								this.setState({renameActive: true});
								this.props.node.setLocked(true);
								this.props.engine.getModel().clearSelection();
								this.props.node.setSelected(true);
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
				<Ports>
					<PortsContainer>
						{_.map(Array.from(this.props.node.getUnaryPredicates()), this.generatePredicate)}
						<PortWidget style={{flexGrow: 1}} engine={this.props.engine} port={this.props.node.getAppendPort()}>
							<Port onClick={() => {
								if(this.state.predicateDropDownMenu){
									this.setState({predicateDropDownMenu:false});
								}
								else{
									//this.props.node.addUnaryPredicate(`Pred${this.props.node.unaryPredicateIndex}`);
									this.setState({predicateDropDownMenu:true});
									//this.props.engine.repaintCanvas();
								}
							}}
								   height={20} width={this.props.node.getOptions().name.length * 20}>{this.state.predicateDropDownMenu?ADDPORTSELECTED:ADDPORT}</Port>
						</PortWidget>
					</PortsContainer>
				</Ports>
			</Node>

				{this.state.predicateDropDownMenu?
					<DropDownNode data-basic-node-name={this.props.name}
						  selected={this.props.node.isSelected()}
						  background={this.props.node.getOptions().color}
						  pointerEvents={this.props.node.isEditable()?"auto":"none"}
						  cursor={this.props.node.isEditable()?"pointer":"move"}>
						<Ports>
							<PortsContainer>
								{_.map(Array.from(this.props.node.getAvailablePredicatesForGivenArity("1")), this.generateAvailablePredicate)}
								<PortWidget style={{flexGrow: 1}} engine={this.props.engine} port={this.props.node.getAppendPort()}>
									<Port onClick={() => {
										this.props.node.addUnaryPredicate(`Pred${this.props.node.unaryPredicateIndex}`);
										this.props.engine.repaintCanvas();
									}}
										  height={20} width={this.props.node.getOptions().name.length * 20}>{ADDPORT}</Port>
								</PortWidget>
							</PortsContainer>
						</Ports>
					</DropDownNode>:null
				}

			</div>
		)
	}
}
