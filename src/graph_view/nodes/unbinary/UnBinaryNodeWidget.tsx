import _ from 'lodash';
import * as React from 'react';
import styled from '@emotion/styled';
import FontAwesome from "react-fontawesome";
import { UnBinaryNodeModel } from './UnBinaryNodeModel';
import { DiagramEngine, PortWidget } from '@projectstorm/react-diagrams';
import { Port } from "./UnBinaryPortLabelWidget";
import {ADDPORT, ADDPORTSELECTED, UNBINARY} from "../ConstantNames";
import {Element, ElementRowContainer} from "../../labels/binary/BinaryLabelWidget";
import {DropDownMenuWidget} from "../DropDownMenuWidget";
import {canUseNameForNode, getWidestElement} from "../functions";

export interface UnBinaryNodeWidgetProps {
	model: UnBinaryNodeModel;
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
	isDropDownMenu?:boolean;
	inputElementTextLength?:number;
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

export const Title = styled.div`
		width: 100%;
		background: rgba(255, 255, 255, 0.45);
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
			background: rgba(255, 255, 255, 0.7);
		}
	`;

export const Ports = styled.div`
		display: flex;
		background-image: linear-gradient(rgba(255, 255, 255, 0.55), rgba(255, 255, 255, 0.65));
	`;

export const PortsContainer = styled.div`
		width: auto;
		display: flex;
		flex-direction: column;
		flex: 1 0 0;
	`;

export const PredicateButton = styled.div`
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
	constructor(props: UnBinaryNodeWidgetProps) {
		super(props);

		this.state = {
			renameActive: false,
			titleChanged: false,
			nodeName: this.props.model.getOptions().name,
			badName: false,
			isDropDownMenu: false,
			inputElementTextLength: 0
		};
		this.setBadNodeNameState = this.setBadNodeNameState.bind(this);
		this.setInputElementTextLength = this.setInputElementTextLength.bind(this);
		this.closeDropDown = this.closeDropDown.bind(this);
	}

	componentDidUpdate(): void {
		this.setIsDropDownMenuAccordingBehaviour();
	}

	generatePredicate = (predicate: string) => {
		return (
			<ElementRowContainer key={predicate} >
				<Element>
					{predicate}
				</Element>
				<PredicateButton onClick={() =>{
					this.props.model.removeUnaryPredicate(predicate);
					this.props.engine.repaintCanvas();
				}}><FontAwesome name={"fas fa-trash"}/></PredicateButton>
			</ElementRowContainer>
		)
	};

	cancelRenameNode() {
		this.setState({renameActive: false, nodeName: this.props.model.getNodeName(), badName: false});
		this.props.model.setLocked(false);
	}

	renameNode(nodeName:string) {
		this.props.model.setLocked(false);

		if (nodeName !== this.props.model.getNodeName()) {
			if (!this.state.badName) {
				this.props.renameDomainNode(this.props.model.getNodeName(),nodeName);
				this.props.model.renameNode(nodeName);
			}
		}

		this.setState({nodeName: this.props.model.getNodeName()});
		this.setState({renameActive: false});
		this.setState({badName: false});
	}

	setBadNodeNameState(bool: boolean) {
		this.setState({badName: bool});
	}

	setInputElementTextLength(length: number){
		this.setState({inputElementTextLength:length});
	}

	setIsDropDownMenuAccordingBehaviour(){
		if(!this.props.model.isSelected() && this.state.isDropDownMenu){
			this.setState({isDropDownMenu:false});
			this.props.model.setLocked(false);
		}
	}

	closeDropDown(){
		if(this.state.isDropDownMenu){
			this.setState({isDropDownMenu:false});
			this.props.model.setLocked(false);
			this.props.engine.getModel().clearSelection();
			this.props.engine.repaintCanvas();
		}
	}

	getWidestElement():number{
		let width:number = this.state.nodeName.length;
		let compareWidth:number = getWidestElement(this.state.isDropDownMenu,this.state.inputElementTextLength,this.props.model,width,"1","0");

		if(compareWidth>width){
			return compareWidth;
		}

		return width;
	}

	render() {
		let width = this.getWidestElement();

		return (
			<div>
				<Node
					data-basic-node-name={this.props.name}
					selected={this.props.model.isSelected()}
					background={this.props.model.getOptions().color}
					pointerEvents={this.props.model.isEditable() ? "auto" : "none"}
					cursor={this.props.model.isEditable() ? "pointer" : "move"}
				>
					<Title title={"Vytvoriť novú linku ťahaním/dvojklikom premenovať názov vrcholu"}>
						<PortWidget style={{flexGrow: 1}} engine={this.props.engine}
									port={this.props.model.getMainPort()}>
							<TitleName onDoubleClick={() => {
								if (this.state.isDropDownMenu) {
									this.setState({isDropDownMenu: false});
								}
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
										width: (width + 1.5) + "ch",
										height: 20 + "px",
										border: this.state.badName ? "1px solid red" : "1px solid black"
									}} name="" value={this.state.nodeName}
										   onChange={(e) => {
											   this.setState({nodeName: e.target.value});
											   let name: string = e.target.value.replace(/\s/g, "");
											   canUseNameForNode(this.props.model.getNodeName(),name,this.setBadNodeNameState,this.props.model.getReduxProps(),UNBINARY);
										   }}/>
								}
							</TitleName>
						</PortWidget>
					</Title>
					<Ports>
						<PortsContainer>
							{_.map(Array.from(this.props.model.getUnaryPredicates()), this.generatePredicate)}
							<PortWidget style={{flexGrow: 1}} engine={this.props.engine}
										port={this.props.model.getAppendPort()}>
								<Port title={"Otvoriť/zatvoriť rozbaľovaciu ponuku"} onClick={() => {
									if (this.state.isDropDownMenu) {
										this.setState({isDropDownMenu: false});
										this.props.engine.getModel().clearSelection();
										this.props.engine.repaintCanvas();
									} else {
										this.setState({isDropDownMenu: true, badNameForNewPredicate: true});
										this.props.engine.getModel().clearSelection();
										this.props.model.setSelected(true);
										this.props.engine.repaintCanvas();
									}
								}}
									  height={20}
									  width={this.props.model.getOptions().name.length * 20}>{this.state.isDropDownMenu ? ADDPORTSELECTED : ADDPORT}</Port>
							</PortWidget>
						</PortsContainer>
					</Ports>
				</Node>

				{(this.state.isDropDownMenu && this.props.model.isSelected()) ?
					<DropDownMenuWidget widthOfInputElement={width}
										setStateInputElementTextLength={this.setInputElementTextLength}
										model={this.props.model}
										engine={this.props.engine} modelName={this.props.model.getNodeName()}
										arity={"1"}
										closeDropDown={this.closeDropDown}/> : null
				}
			</div>
		)
	}
}
