import _ from "lodash";
import * as React from 'react';
import styled from '@emotion/styled';
import FontAwesome from "react-fontawesome";
import { BinaryLabelModel } from './BinaryLabelModel';
import {DiagramEngine} from '@projectstorm/react-diagrams';
import {ADDPORT, ADDPORTSELECTED, BOTH, FROM} from "../../nodes/ConstantNames";
import {DropDownMenuWidget} from "../../nodes/DropDownMenuWidget";
import {Port} from "../../nodes/unbinary/UnBinaryPortLabelWidget";

export interface BinaryLabelWidgetProps {
	model: BinaryLabelModel;
	engine: DiagramEngine;
	name?:string;
	size?: number;
}

export const PredicatesNode = styled.div<{pointerEvents: string, cursor:string}>`
		pointer-events: ${p => p.pointerEvents};
		cursor: ${p => p.cursor};
		width:100%;
		height:100%;
		background-color: yellow;
		border-radius: 5px;
		font-family: sans-serif;
		color: black;
		border: solid 2px black;
		overflow: visible;
		font-size: 12px;
		font-weight: bold;

	`;

export const Predicate = styled.div`
		min-width: 2em;
		width: 100%;
		height: 20px;
		background: rgba(white, 0.1);
		color: black;
		text-align:center;
	`;

export const Predicates = styled.div`
		display: flex;
		background-image: linear-gradient(rgba(256, 256, 256, 0.4), rgba(256, 256, 256, 0.5));
	`;

export const PredicateContainer = styled.div`
		display: flex;
		flex-direction: column;
		flex-grow:1;

		&:first-of-type {
			margin-right: 10px;
		}

		&:only-child {
			margin-right: 0px;
		}
	`;

export const PredicateRowContainer = styled.div`
		display: flex;
		flex-direction: row;
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

export const Title = styled.div`
		width: 100%;
		background: rgba(256, 256, 256, 0.15);
		display: flex;
		white-space: nowrap;
		justify-items: center;
		text-align:center;
		cursor: default;
	`;

export const TitleName = styled.div`
		width: 100%;
		flex-grow: 1;
		padding: 5px 5px;
	`;

interface BinaryNodeWidgetState {
	renameActive?:boolean;
	titleChanged?:boolean;
	isDropDownMenu:boolean;
	badNameForNewPredicate: boolean;
	inputElementTextLength: number;
}

export class BinaryLabelWidget extends React.Component<BinaryLabelWidgetProps,BinaryNodeWidgetState> {
	predicateTextInput:any;
	constructor(props: BinaryLabelWidgetProps) {
		super(props);

		this.state = {
			isDropDownMenu: false,
			badNameForNewPredicate: false,
			inputElementTextLength: 0
		};
		this.setBadNameForNewPredicateState = this.setBadNameForNewPredicateState.bind(this);
		this.setInputElementTextLength = this.setInputElementTextLength.bind(this);
	}

	generatePredicate = (predicateObject: string) => {
			return (
				<PredicateRowContainer key={predicateObject[0]} >
					<PredicateButton onClick={() =>{
						this.props.model.changeDirectionOfPredicate(predicateObject[0], predicateObject[1]);
						this.props.engine.repaintCanvas();
					}}><FontAwesome name={predicateObject[1]===BOTH?'fas fa-arrows-alt-h':(predicateObject[1]===FROM?"fas fa-long-arrow-alt-right":"fas fa-long-arrow-alt-left")}/></PredicateButton>

				<Predicate>
					{predicateObject[0]}
				</Predicate>
					<PredicateButton onClick={() =>{
						this.props.model.removePredicate(predicateObject[0]);
						this.props.engine.repaintCanvas();
					}}><FontAwesome name={"fas fa-trash"}/></PredicateButton>
				</PredicateRowContainer>
			)
		};

	componentDidUpdate() {
		this.setIsDropDownMenuAccordingBehaviour();
	}

	setIsDropDownMenuAccordingBehaviour(){
		if(!this.props.model.getParent().isSelected() && this.state.isDropDownMenu){
			this.setState({isDropDownMenu:false});
			this.props.model.setLockedParent(false);
			this.props.model.setLocked(false);
		}
	}

	getWidestElement(firstNodeName:string,secondNodeName:string):number{
		let width:number = firstNodeName.length+secondNodeName.length;
		let minimumWidth:number = 0;

		if(this.state.renameActive){
			if(width<minimumWidth){
				width = minimumWidth;
			}
		}

		if(this.state.isDropDownMenu){
			let predicateWidth = this.props.model.getMaximumLengthOfPredicatesForGivenArity("2");
			if(width<predicateWidth){
				width = predicateWidth;
			}
			if(this.predicateTextInput && this.predicateTextInput.value.length>width){
				width = this.predicateTextInput.value.length;
			}
		}
		return width;
	}

	setInputElementTextLength(length: number){
		this.setState({inputElementTextLength:length});
	}

	setBadNameForNewPredicateState(bool:boolean){
		this.setState({badNameForNewPredicate: bool});
	}

	render() {
		let link = this.props.model.getParent();
		// @ts-ignore
		let sourceNodeName = link.getSourcePort().getNode().getNodeName();
		// @ts-ignore
		let targetNodeName = link.getTargetPort().getNode().getNodeName();

		let width = this.getWidestElement(sourceNodeName, targetNodeName);

		return (
			<div>
				<PredicatesNode pointerEvents={this.props.model.editable ? "all" : "none"}
								cursor={this.props.model.editable ? "pointer" : "move"}>
					<Title>
						<TitleName>
							{sourceNodeName + " – " + targetNodeName}
						</TitleName>
					</Title>
					<Predicates>
						<PredicateContainer>
							{_.map(Array.from(this.props.model.getPredicates()), this.generatePredicate)}
							<Port onClick={() => {
								if (this.state.isDropDownMenu) {
									this.props.engine.getModel().clearSelection();
									this.setState({isDropDownMenu: false});
									this.props.engine.repaintCanvas();
								} else {
									this.props.engine.getModel().clearSelection();
									this.props.model.setSelected(true);
									this.props.model.getParent().setSelected(true);
									this.setState({isDropDownMenu: true, badNameForNewPredicate: true});
									this.props.engine.repaintCanvas();
								}
							}}
								  height={20}
								  width={this.props.model.getOptions().name?0:20}>{this.state.isDropDownMenu ? ADDPORTSELECTED : ADDPORT}</Port>
						</PredicateContainer>
					</Predicates>
				</PredicatesNode>
				{(this.state.isDropDownMenu && this.props.model.getParent().isSelected()) ?
					<DropDownMenuWidget model={this.props.model} engine={this.props.engine}
										badNameForLanguageElement={this.state.badNameForNewPredicate}
										setStateBadNameForLanguageElement={this.setBadNameForNewPredicateState}
										setStateInputElementTextLength={this.setInputElementTextLength}
										widthOfInputElement={width} arity={"2"}/> : null
				}
			</div>
		)
	}
}
