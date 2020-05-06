import * as React from 'react';
import { DiagramEngine, PortWidget } from '@projectstorm/react-diagrams';
import styled from '@emotion/styled';
import { TernaryNodeModel } from './TernaryNodeModel';
import {
	DropDownMenuWidget
} from "../DropDownMenuWidget";
import {getWidestElement, selectOnlyCurrentGraphElement} from '../functions';
import {ADDPORT, ADDPORTSELECTED, FUNCTION, PREDICATE} from "../ConstantNames";
import {ElementContainer} from "../../labels/binary/BinaryLabelWidget";
import {Port as PortClassic} from "../../nodes/unbinary/UnBinaryPortLabelWidget";
import _ from "lodash";
import {NaryListWidget} from "../NaryListWidget";

export interface TernaryNodeWidgetProps {
	model: TernaryNodeModel;
	engine: DiagramEngine;
	size?: number;
}

interface TernaryNodeWidgetState {
	nodeName?:string;
	badName?:boolean;
	color?:any;
	isDropDownMenu?:boolean;
	inputElementTextLength?:number;
}

export const Element = styled.div`
	display: flex;
    justify-content: center;
    flex-direction: column;
`;

export const Port = styled.div`
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

export const NaryNodeList = styled.div<{pointerEvents: string, cursor:string}>`
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

export const Elements = styled.div`
		display: flex;
		background-image: linear-gradient(rgba(256, 256, 256, 0.4), rgba(256, 256, 256, 0.5));
	`;

export const Node = styled.div<{ size: number, pointerEvents: string, cursor:string}>`
	position: 'relative';
	pointer-events: ${p => p.pointerEvents};
	cursor: ${p => p.cursor};
	display:flex;
	justify-content: center;
	/*width: ${p => p.size};*/
	height:35px;
`;

export class TernaryNodeWidget extends React.Component<TernaryNodeWidgetProps,TernaryNodeWidgetState> {

	constructor(props: TernaryNodeWidgetProps) {
		super(props);

		this.state = {
			badName: false,
			isDropDownMenu: false,
			color: "rgb(255,255,0)",
			inputElementTextLength: 0
		};

		this.setInputElementTextLength = this.setInputElementTextLength.bind(this);
		this.closeDropDown = this.closeDropDown.bind(this);
		this.generateFunctionComponent = this.generateFunctionComponent.bind(this);
		this.generatePredicateComponent = this.generatePredicateComponent.bind(this);
	}

	componentDidUpdate(): void {
		this.setIsDropDownMenuAccordingBehaviour();
	}

	setInputElementTextLength(length: number) {
		this.setState({inputElementTextLength: length});
	}


	setIsDropDownMenuAccordingBehaviour() {
		if (!this.props.model.isSelected() && this.state.isDropDownMenu) {
			this.setState({isDropDownMenu: false});
			this.props.model.setLocked(false);
		}
	}

	closeDropDown() {
		if (this.state.isDropDownMenu) {
			this.setState({isDropDownMenu: false});
			this.props.model.setLocked(false);
			this.props.engine.getModel().clearSelection();
			this.props.engine.repaintCanvas();
		}
	}

	generatePredicateComponent(elementName:string){
		return <NaryListWidget engine={this.props.engine} model={this.props.model} elementName={elementName} type={PREDICATE} key={elementName}/>
	}

	generateFunctionComponent(elementName:string){
		return <NaryListWidget engine={this.props.engine} model={this.props.model} elementName={elementName} type={FUNCTION} key={elementName}/>
	}

	getWidestElement(): number {
		let width: number = 3;
		let compareWidth: number = getWidestElement(this.state.isDropDownMenu, this.state.inputElementTextLength, this.props.model, width, "3", "2");

		if (compareWidth > width) {
			return compareWidth;
		}

		return width;
	}

	render() {
		let width = this.getWidestElement();
		return (
			<Element>
				<Node size={this.props.size}
					  pointerEvents={this.props.model.isEditable() ? "auto" : "none"}
					  cursor={this.props.model.isEditable() ? "pointer" : "move"}
					  onClick={() => {
						  selectOnlyCurrentGraphElement(this.props.model,this.props.engine);
					  }}>


					<svg width={this.props.size} height={this.props.size}>
						<g id="Layer_1">
						</g>
						<g id="Layer_2">
							<polygon
									 points={"5," + this.props.size / 2 + " " + this.props.size / 2 + ",0" + " " + this.props.size + "," + this.props.size / 2 + " " + this.props.size / 2 + "," + this.props.size / 2}
									 style={{
										 fill: this.state.color,
										 strokeMiterlimit: 10,
										 strokeWidth: 2.5,
										 stroke: this.props.model.isSelected() ? "rgb(0,192,255)" : "#000000"
									 }}/>
						</g>
					</svg>
					<PortWidget
						style={{
							top: this.props.size / 2 - 9,
							left: 50+"%",
							marginLeft: -35+"px",
							position: 'absolute'
						}}
						port={this.props.model.getPortByIndex(0)}
						engine={this.props.engine}>
						<Port title={"Prvý parameter"}/>
					</PortWidget>
					<PortWidget
						style={{
							right: 50+"%",
							marginRight: -38+"px",
							top: this.props.size / 2 - 10,
							position: 'absolute'
						}}
						port={this.props.model.getPortByIndex(1)}
						engine={this.props.engine}>
						<Port title={"Druhý parameter"}/>
					</PortWidget>
					<PortWidget
						style={{
							top: -15,
							position: 'absolute'
						}}
						port={this.props.model.getPortByIndex(2)}
						engine={this.props.engine}>
						<Port title={"Tretí parameter"}/>
					</PortWidget>
				</Node>
				<NaryNodeList pointerEvents={this.props.model.isEditable() ? "auto" : "none"}
							  cursor={this.props.model.isEditable() ? "pointer" : "move"} s>
					<Elements>
						<ElementContainer>
							{_.map(Array.from(this.props.model.getPredicates()), this.generatePredicateComponent)}
							{_.map(Array.from(this.props.model.getFunctions()), this.generateFunctionComponent)}
							<PortWidget engine={this.props.engine}
										port={this.props.model.getAppendPort()}>
							<PortClassic title={"Otvoriť/zatvoriť rozbaľovaciu ponuku"} onClick={() => {
								if (this.state.isDropDownMenu) {
									this.props.engine.getModel().clearSelection();
									this.setState({isDropDownMenu: false});
									this.props.engine.repaintCanvas();
								} else {
									this.props.engine.getModel().clearSelection();
									this.props.model.setSelected(true);
									this.setState({isDropDownMenu: true});
									this.props.engine.repaintCanvas();
								}
							}}
										 height={20}
										 width={this.props.model.getOptions().name ? 0 : 20}>{this.state.isDropDownMenu ? ADDPORTSELECTED : ADDPORT}</PortClassic>
							</PortWidget>
						</ElementContainer>
					</Elements>
				</NaryNodeList>
				{(this.state.isDropDownMenu && this.props.model.isSelected()) ?
					<DropDownMenuWidget widthOfInputElement={width}
										setStateInputElementTextLength={this.setInputElementTextLength}
										model={this.props.model}
										engine={this.props.engine} modelName={this.props.model.getNodeName()}
										arity={"3"}
										closeDropDown={this.closeDropDown}/> : null
				}
			</Element>
		);
	}
}
