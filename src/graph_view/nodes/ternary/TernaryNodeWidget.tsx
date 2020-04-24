import * as React from 'react';
import { DiagramEngine, PortModelAlignment, PortWidget } from '@projectstorm/react-diagrams';
import styled from '@emotion/styled';
import { TernaryNodeModel } from './TernaryNodeModel';
import {
	DropDownMenuWidget
} from "../DropDownMenuWidget";
import { getWidestElement } from '../functions';
import {ADDPORT, ADDPORTSELECTED} from "../ConstantNames";

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

export const ToggleButton = styled.div`
	position:absolute;
	top: 5px;
	font-size: 12px;
	pointer-events: none;
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
			color:"rgb(255,255,0)",
			inputElementTextLength: 0
		};

		this.setInputElementTextLength = this.setInputElementTextLength.bind(this);
		this.closeDropDown = this.closeDropDown.bind(this);
	}

	componentDidUpdate(): void {
		this.setIsDropDownMenuAccordingBehaviour();
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

	setColor(color:any){
		this.setState({color:color});
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
		return 10;
		let width:number = this.state.nodeName.length;
		let compareWidth:number = getWidestElement(this.state.isDropDownMenu,this.state.inputElementTextLength,this.props.model,width,"1","0");

		if(compareWidth>width){
			return compareWidth;
		}

		return width;
	}

	render(){
	let width = this.getWidestElement();
		return (
			<Element>
			<Node size={this.props.size}
				  pointerEvents={this.props.model.isEditable() ? "auto" : "none"}
				  cursor={this.props.model.isEditable() ? "pointer" : "move"}>


				<svg width={this.props.size} height={this.props.size}>
					<g id="Layer_1">
					</g>
					<g id="Layer_2">
						<polygon onMouseEnter={() => {this.setColor("rgba(255,255,0,0.5)")}}
						onMouseLeave={() => {this.setColor("rgb(255,255,0)")}} onClick={() => {this.setState({isDropDownMenu:!this.state.isDropDownMenu})}} points={"5,"+this.props.size/2+" "+this.props.size/2+",0"+" "+this.props.size+","+this.props.size/2+" "+this.props.size/2+","+this.props.size/2}
								 style={{fill:this.state.color,strokeMiterlimit:10,strokeWidth:2.5,stroke:this.props.model.isSelected()?"rgb(0,192,255)":"#000000"}}/>
					</g>
				</svg>
				<ToggleButton>
					{this.state.isDropDownMenu?ADDPORTSELECTED:ADDPORT}
				</ToggleButton>

				<PortWidget
					style={{
						top: this.props.size / 2 - 9,
						left: -10,
						position: 'absolute'
					}}
					port={this.props.model.getPort(PortModelAlignment.LEFT)}
					engine={this.props.engine}>
					<Port />
				</PortWidget>
				<PortWidget
					style={{
						top: -15,
						position: 'absolute'
					}}
					port={this.props.model.getPort(PortModelAlignment.TOP)}
					engine={this.props.engine}>
					<Port />
				</PortWidget>
				<PortWidget
					style={{
						right:-10,
						top: this.props.size / 2 - 10,
						position: 'absolute'
					}}
					port={this.props.model.getPort(PortModelAlignment.RIGHT)}
					engine={this.props.engine}>
					<Port />
				</PortWidget>
			</Node>
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
