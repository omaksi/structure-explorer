import * as React from 'react';
import { BinaryLabelModel } from './BinaryLabelModel';
import styled from '@emotion/styled';
import {DiagramEngine, PortWidget} from '@projectstorm/react-diagrams';
import {ADDPORT} from "../../nodes/ConstantNames";
import _ from "lodash";
import FontAwesome from "react-fontawesome";
import {InputElement, PortsContainer} from "../../nodes/unbinary/UnBinaryNodeWidget";
import {UnBinaryNodeModel} from "../../nodes/unbinary/UnBinaryNodeModel";

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

export const LabelDropDownMenu = styled.div<{pointerEvents: string, cursor:string}>`
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

export const LabelDropDownPorts = styled.div`
		display: flex;
		background-image: linear-gradient(rgba(256, 256, 256, 0.9), rgba(256, 256, 256, 0.9));
	`;

interface BinaryNodeWidgetState {
	renameActive?:boolean;
	titleChanged?:boolean;
	predicateDropDownMenu:boolean;
	badNameForNewPredicate: boolean;
}

export class BinaryLabelWidget extends React.Component<BinaryLabelWidgetProps,BinaryNodeWidgetState> {
	predicateTextInput:any;
	constructor(props: BinaryLabelWidgetProps) {
		super(props);

		this.state = {
			predicateDropDownMenu: false,
			badNameForNewPredicate: false
		};
	}

	generatePredicate = (predicateObject: string) => {
			return (
				<PredicateRowContainer key={predicateObject[0]} >
					<PredicateButton onClick={() =>{
						this.props.model.changeDirectionOfPredicate(predicateObject[0], predicateObject[1]);
						this.forceUpdate();
					}}><FontAwesome name={predicateObject[1]==="b"?'fas fa-arrows-alt-h':(predicateObject[1]==="f"?"fas fa-long-arrow-alt-right":"fas fa-long-arrow-alt-left")}/></PredicateButton>

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
		window.requestAnimationFrame(this.calculateLabelPosition);
	}

	componentDidMount() {
		window.requestAnimationFrame(this.calculateLabelPosition);
	}

	findPathAndRelativePositionToRenderLabel = (index: number): { path: SVGPathElement; position: number } => {
		// an array to hold all path lengths, making sure we hit the DOM only once to fetch this information
		const link = this.props.model.getParent();
		const lengths = link.getRenderedPath().map((path: any) => path.getTotalLength());

		// calculate the point where we want to display the label
		let labelPosition =
			lengths.reduce((previousValue: number, currentValue: number) => previousValue + currentValue, 0) *
			(index / (link.getLabels().length + 1));

		// find the path where the label will be rendered and calculate the relative position
		let pathIndex = 0;
		while (pathIndex < link.getRenderedPath().length) {
			if (labelPosition - lengths[pathIndex] < 0) {
				return {
					path: link.getRenderedPath()[pathIndex],
					position: labelPosition
				};
			}

			// keep searching
			labelPosition -= lengths[pathIndex];
			pathIndex++;
		}
	};

	calculateLabelPosition = () => {
		const found = this.findPathAndRelativePositionToRenderLabel(1);
		if (!found) {
			return;
		}

		const {path, position} = found;

		const labelDimensions = {
			//width: this.ref.current.offsetWidth,
			//height: this.ref.current.offsetHeight
			width: this.props.model.getOptions().offsetX,
			height: this.props.model.getOptions().offsetY
		};

		const pathCentre = path.getPointAtLength(position);

		const labelCoordinates = {
			x: pathCentre.x - labelDimensions.width / 2 + this.props.model.getOptions().offsetX,
			y: pathCentre.y - labelDimensions.height / 2 + this.props.model.getOptions().offsetY
		};

		//this.ref.current.style.transform = `translate(${labelCoordinates.x}px, ${labelCoordinates.y}px)`;
	};

	generateAvailablePredicate = (predicate: string) => {
		return (
			<PredicateRowContainer key={predicate} >
				<Predicate onClick={() =>{
					this.props.model.addPredicate(predicate);
					this.props.engine.repaintCanvas();
				}}>
					{predicate}
				</Predicate>
				<PredicateButton onClick={() =>{
					this.props.model.addPredicate(predicate);
					this.props.engine.repaintCanvas();
				}}><FontAwesome name={"fas fa-plus"}/></PredicateButton>
			</PredicateRowContainer>
		)
	};

	checkBadPredName(predName:string,arity:string,node:UnBinaryNodeModel){
		predName = predName.replace(/\s/g, "");

		if(predName === ""){
			this.setState({badNameForNewPredicate:true});
			return;
		}

		this.setState({badNameForNewPredicate:!node.canUsePredicateForGivenArity(predName,arity)});
	}

	getWidestElement(firstNodeName:string,secondNodeName:string):number{
		let width:number = firstNodeName.length+secondNodeName.length;
		/*let minimumWidth:number = this.props.model;

		if(this.state.renameActive){
			if(width<minimumWidth){
				width = minimumWidth;
			}
		}

		if(this.state.predicateDropDownMenu){
			let predicateWidth = this.props.node.getMaximumLengthOfPredicatesForGivenArity("1");
			if(width<predicateWidth){
				width = predicateWidth;
			}
			if(this.predicateTextInput && this.predicateTextInput.value.length>width){
				width = this.predicateTextInput.value.length;
			}
		}*/
		return width;
	}

	render() {
		let link = this.props.model.getParent();
		// @ts-ignore
		let sourceNodeName = link.getSourcePort().getNode().getNodeName();
		// @ts-ignore
		let targetNodeName = link.getTargetPort().getNode().getNodeName();

		let node:UnBinaryNodeModel;
		let tempNode = link.getSourcePort().getNode();
		node = tempNode instanceof UnBinaryNodeModel?tempNode:null;

		let width = this.getWidestElement(sourceNodeName,targetNodeName);

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
							<Predicate onClick={() => {
								this.props.model.addPredicate(`Pred${this.props.model.predicateIndex}`);
								this.props.engine.repaintCanvas();
							}}>
								{ADDPORT}
							</Predicate>
						</PredicateContainer>
					</Predicates>
				</PredicatesNode>
				{(this.state.predicateDropDownMenu && this.props.model.isSelected())?
					<LabelDropDownMenu  pointerEvents={this.props.model.editable?"auto":"none"}
								  cursor={this.props.model.editable?"pointer":"move"}>
						<LabelDropDownPorts>
							<PortsContainer>
								{_.map(Array.from(node.getAvailablePredicatesForGivenArity("2")), this.generateAvailablePredicate)}
								<InputElement>
										<PredicateRowContainer key={"lastBinaryPredicateOption"}>
											<input onChange={(e) => this.checkBadPredName(e.target.value,"2",node)} ref={(input) => this.predicateTextInput = input} onFocus={() => link.setLocked(true)} onBlur={() => link.setLocked(false)} placeholder={"Predicate"} style={{
												width: (width)+"ch",
												height: 20 + "px",
												border: this.state.badNameForNewPredicate ? "1px solid red" : "1px solid black"
											}}>
											</input>
											<PredicateButton onClick={() =>{
												if(!this.state.badNameForNewPredicate && this.predicateTextInput.value){
													this.props.model.addPredicate(this.predicateTextInput.value);
													this.predicateTextInput.value = "";
													this.setState({badNameForNewPredicate:true});
													this.props.engine.repaintCanvas();
												}
											}}>{ADDPORT}</PredicateButton>
										</PredicateRowContainer>
								</InputElement>
							</PortsContainer>
						</LabelDropDownPorts>
					</LabelDropDownMenu>:null
				}
			</div>
		)
	}
}
