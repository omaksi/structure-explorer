import * as React from 'react';
import { QuaternaryNodeModel } from './QuaternaryNodeModel';
import { DiagramEngine, PortWidget } from '@projectstorm/react-diagrams';
import styled from '@emotion/styled';
import {ElementContainer} from "../../labels/binary/BinaryLabelWidget";
import _ from "lodash";
import {Port as PortClassic} from "../unbinary/UnBinaryPortLabelWidget";
import {ADDPORT, ADDPORTSELECTED, FUNCTION, PREDICATE} from "../ConstantNames";
import {DropDownMenuWidget} from "../DropDownMenuWidget";
import {NaryNodeList} from "../ternary/TernaryNodeWidget";
import {NaryListWidget} from "../NaryListWidget";
import {getWidestElement, selectOnlyCurrentGraphElement} from '../functions';

export interface QuaternaryNodeWidgetProps {
	model: QuaternaryNodeModel;
	engine: DiagramEngine;
	size?: number;
}

interface QuaternaryNodeWidgetState {
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

export const Elements = styled.div`
		display: flex;
		background-image: linear-gradient(rgba(256, 256, 256, 0.4), rgba(256, 256, 256, 0.5));
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

export const Node = styled.div<{ size: number, pointerEvents: string, cursor:string}>`
	position: 'relative';
	pointer-events: ${p => p.pointerEvents};
	cursor: ${p => p.cursor};
	display:flex;
	justify-content: center;
	height: 60px;
`;

export class NodeWidget extends React.Component<{ size: number, color: string, isSelected: boolean }> {
	render() {
		let {size, color, isSelected} = this.props;
		return (
			<svg width={size} height={size}>
				<g id="Layer_1">
				</g>
				<g id="Layer_2">
					<polygon
						points={"10," + this.props.size / 2 + " " + this.props.size / 2 + ",10" + " " + (this.props.size-10) + "," + this.props.size / 2 + " " + this.props.size / 2 + "," + (this.props.size -10)}
						style={{
							fill: color,
							strokeMiterlimit: 10,
							strokeWidth: 2.5,
							stroke: isSelected ? "rgb(0,192,255)" : "#000000"
						}}/>
				</g>
			</svg>
		);
	}
}

export class QuaternaryNodeWidget extends React.Component<QuaternaryNodeWidgetProps,QuaternaryNodeWidgetState> {

	constructor(props: QuaternaryNodeWidgetProps) {
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

	setColor(color: any) {
		this.setState({color: color});
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
		let compareWidth: number = getWidestElement(this.state.isDropDownMenu, this.state.inputElementTextLength, this.props.model, width, "1", "0");

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

					<NodeWidget size={this.props.size} color={this.state.color} isSelected={this.props.model.isSelected()}/>
					<PortWidget
						style={{
							top: this.props.size / 2 - 9,
							left: 50+"%",
							marginLeft: -32+"px",
							position: 'absolute'
						}}
						port={this.props.model.getPortByIndex(0)}
						engine={this.props.engine}>
						<Port title={"Prvý parameter"} />
					</PortWidget>
					<PortWidget
						style={{
							top: this.props.size - 8,
							position: 'absolute'
						}}
						port={this.props.model.getPortByIndex(1)}
						engine={this.props.engine}>
						<Port title={"Druhý parameter"} />
					</PortWidget>

					<PortWidget
						style={{
							right: 50+"%",
							marginRight: -32+"px",
							top: this.props.size / 2 - 9,
							position: 'absolute'

						}}
						port={this.props.model.getPortByIndex(2)}
						engine={this.props.engine}>
						<Port title={"Tretí parameter"} />
					</PortWidget>
					<PortWidget
						style={{
							top: -8,
							position: 'absolute'
						}}
						port={this.props.model.getPortByIndex(3)}
						engine={this.props.engine}>
						<Port title={"Štvrtý parameter"} />
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
										arity={"4"}
										closeDropDown={this.closeDropDown}/> : null
				}
			</Element>
		);
	}
}
