import _ from "lodash";
import * as React from 'react';
import styled from '@emotion/styled';
import FontAwesome from "react-fontawesome";
import { BinaryLabelModel } from './BinaryLabelModel';
import {DiagramEngine} from '@projectstorm/react-diagrams';
import {ADDPORT, ADDPORTSELECTED, BOTH, FROM, FUNCTION, PREDICATE} from "../../nodes/ConstantNames";
import {DropDownMenuWidget} from "../../nodes/DropDownMenuWidget";
import {Port} from "../../nodes/unbinary/UnBinaryPortLabelWidget";
import {getWidestElement} from "../../nodes/functions";

export interface BinaryLabelWidgetProps {
	model: BinaryLabelModel;
	engine: DiagramEngine;
	name?:string;
	size?: number;
}

export const ElementsNode = styled.div<{pointerEvents: string, cursor:string}>`
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

export const Element = styled.div`
		min-width: 2em;
		width: 100%;
		height: 20px;
		background: rgba(white, 0.1);
		color: black;
		text-align:center;
	`;

export const Elements = styled.div`
		display: flex;
		background-image: linear-gradient(rgba(256, 256, 256, 0.4), rgba(256, 256, 256, 0.5));
	`;

export const ElementContainer = styled.div`
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

export const ElementRowContainer = styled.div`
		display: flex;
		flex-direction: row;
		flex: 1 0 0;
	`;

export const ElementButton = styled.div`
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
	sourceNodeName:string;
	targetNodeName:string;

	constructor(props: BinaryLabelWidgetProps) {
		super(props);

		this.state = {
			isDropDownMenu: false,
			badNameForNewPredicate: false,
			inputElementTextLength: 0
		};
		this.setInputElementTextLength = this.setInputElementTextLength.bind(this);
		this.closeDropDown = this.closeDropDown.bind(this);
		this.generateElementType = this.generateElementType.bind(this);
		this.generatePredicateComponent = this.generatePredicateComponent.bind(this);
		this.generateFunctionComponent = this.generateFunctionComponent.bind(this);
	}

	generateElementType = (elementObject: string,type: string) => {
		return (
				<ElementRowContainer key={elementObject[0]} >
					{this.sourceNodeName !== this.targetNodeName?
					<ElementButton onClick={() =>{
						this.props.model.changeDirectionOfBinaryRelation(elementObject[0], elementObject[1],type);
						this.props.engine.repaintCanvas();
					}}><FontAwesome title={"Smer "+(type===PREDICATE?"predikátu":"funkcie")} name={elementObject[1]===BOTH?'fas fa-arrows-alt-h':(elementObject[1]===FROM?"fas fa-long-arrow-alt-right":"fas fa-long-arrow-alt-left")}/></ElementButton>:null}
				<Element title={type===PREDICATE?"Predikát":"Funkcia"}>
					{elementObject[0]}
				</Element>
					<ElementButton title={"Zmazať "+(type===PREDICATE?"daný predikát":"danú funkciu")+" z vrcholu"} onClick={() =>{
						type===PREDICATE?this.props.model.removePredicate(elementObject[0]):this.props.model.removeFunction(elementObject[0]);
						this.props.engine.repaintCanvas();
					}}><FontAwesome name={"fas fa-trash"}/></ElementButton>
				</ElementRowContainer>
			)
		};

	generatePredicateComponent(elementObject:string){
			return this.generateElementType(elementObject,PREDICATE);
	}

	generateFunctionComponent(elementObject:string){
		return this.generateElementType(elementObject,FUNCTION);
	}

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

	getWidestElement():number{
		let width:number = this.sourceNodeName.length+this.targetNodeName.length;
		let compareWidth:number = getWidestElement(this.state.isDropDownMenu,this.state.inputElementTextLength,this.props.model,width,"2","1");

		if(compareWidth>width){
			return compareWidth;
		}

		return width;
	}

	setInputElementTextLength(length: number){
		this.setState({inputElementTextLength:length});
	}

	closeDropDown(){
		this.setState({isDropDownMenu:false});
		this.props.model.setLocked(false);
		this.props.engine.getModel().clearSelection();
		this.props.engine.repaintCanvas();
	}

	render() {
		// @ts-ignore
		this.sourceNodeName = this.props.model.getParent().getSourcePort().getNode().getNodeName();
		// @ts-ignore
		this.targetNodeName = this.props.model.getParent().getTargetPort().getNode().getNodeName();

		let width = this.getWidestElement();

		return (
			<div>
				<ElementsNode pointerEvents={this.props.model.editable ? "all" : "none"}
							  cursor={this.props.model.editable ? "pointer" : "move"}>
					<Title title={"Smerovanie predikátov/funkcií (od – do)"}>
						<TitleName>
							{this.sourceNodeName + " – " + this.targetNodeName}
						</TitleName>
					</Title>
					<Elements>
						<ElementContainer>
							{_.map(Array.from(this.props.model.getPredicates()), this.generatePredicateComponent)}
							{_.map(Array.from(this.props.model.getFunctions()), this.generateFunctionComponent)}
							<Port title={"Otvoriť/zatvoriť rozbaľovaciu ponuku"} onClick={() => {
								if (this.state.isDropDownMenu) {
									this.props.engine.getModel().clearSelection();
									this.setState({isDropDownMenu: false});
									this.props.engine.repaintCanvas();
								} else {
									this.props.engine.getModel().clearSelection();
									this.props.model.setSelected(true);
									this.props.model.getParent().setSelected(true);
									this.setState({isDropDownMenu: true});
									this.props.engine.repaintCanvas();
								}
							}}
								  height={20}
								  width={this.props.model.getOptions().name?0:20}>{this.state.isDropDownMenu ? ADDPORTSELECTED : ADDPORT}</Port>
						</ElementContainer>
					</Elements>
				</ElementsNode>
				{(this.state.isDropDownMenu && this.props.model.getParent().isSelected()) ?
					<DropDownMenuWidget model={this.props.model} engine={this.props.engine}
										badNameForLanguageElement={this.state.badNameForNewPredicate}
										setStateInputElementTextLength={this.setInputElementTextLength}
										widthOfInputElement={width} arity={"2"} closeDropDown={this.closeDropDown}/> : null
				}
			</div>
		)
	}
}
