import * as React from 'react';
import * as _ from 'lodash';
import { TrayWidget } from './TrayWidget';
import { Application } from '../Application';
import {DiamondItemWidget, UnbinaryItemWidget} from './TrayItemWidget';
import { DefaultNodeModel } from '@projectstorm/react-diagrams';
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import { MainCanvasWidget } from './MainCanvasWidget';
import styled from '@emotion/styled';
import {DiamondNodeModel} from "../nodes/diamond/DiamondNodeModel";
import {UnBinaryNodeModel} from "../nodes/unbinary/UnBinaryNodeModel";
import {ConstantNodeModel} from "../nodes/constant/ConstantNodeModel";
import {addDomainNode, removeDomainNode} from "../../actions";

export interface BodyWidgetProps {
	app: Application;
	setDomain:any;
	changeDomain:any;
	syncDiagram:any;
	addDomainNode:any;
	removeDomainNode:any;
	addConstantNode:any;
	removeConstantNode:any;
	diagramNodeState:any;
}

	export const Body = styled.div`
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
	`;

	export const Header = styled.div`
		display: flex;
		background: rgb(30, 30, 30);
		flex-grow: 0;
		flex-shrink: 0;
		color: white;
		font-family: Helvetica, Arial, sans-serif;
		padding: 10px;
		align-items: center;
	`;

	export const Content = styled.div`
		display: flex;
		flex-grow: 1;
	`;

	export const Layer = styled.div`
		position: relative;
		flex-grow: 1;
	`;


	function getAvailableCount(nodeType:string,diagramNodeState:any):number {
		let nodeCount = 0;
		let state:Map<string,object>;
		if (nodeType === 'unbinary') {
			state = diagramNodeState.domainNodes;
			}

		else if(nodeType === 'constant'){
			state = diagramNodeState.constantNodes;
		}

		else{
			state = diagramNodeState.functionNodes;
		}

		while(state.has('Node'+nodeCount)){
			nodeCount++;
		}
		return nodeCount;
	}

	function createNode(element:any,event:any,reduxFunctions:any,clicked:boolean=true) {
		let data;
		if (clicked) {
			data = JSON.parse(event);
		} else {
			data = JSON.parse(event.dataTransfer.getData('storm-diagram-node'));
		}

		let nodesCount = getAvailableCount(data.type,element.props.diagramNodeState);

		let node: any = null;
		if (data.type === 'diamond') {
			node = new DiamondNodeModel();
		} else if (data.type === 'unbinary') {
			node = new UnBinaryNodeModel('Node' + nodesCount, 'rgb(92,192,125)', reduxFunctions);
			reduxFunctions.addDomainNode(node.getOptions().name,node);

		} else if (data.type === 'constant') {
			node = new ConstantNodeModel('Node' + nodesCount, 'rgb(92,192,125)', reduxFunctions);
			reduxFunctions.addConstantNode(node.getOptions().name,node);
		} else {
			node = new DefaultNodeModel('Node' + nodesCount, 'rgb(0,192,255)');
			node.addOutPort('Out');
		}

		if(node === null){
			throw new DOMException("Node cannot be null, possible leak of unknown type");
		}

		let point;

		if (clicked) {
			let canvasWidth = element.props.app.getDiagramEngine().getCanvas().clientWidth;
			let canvasHeight = element.props.app.getDiagramEngine().getCanvas().clientHeight;
			point = {x: Math.random()*(canvasWidth-canvasWidth*0.1)+canvasWidth*0.05, y: Math.random()*(canvasHeight-canvasHeight*0.2)+canvasHeight*0.05};
		} else {
			point = element.props.app.getDiagramEngine().getRelativeMousePoint(event);
		}

		node.setPosition(point);
		element.props.app
			.getDiagramEngine()
			.getModel().addNode(node);
		//element.forceUpdate();
	}



export class BodyWidget extends React.Component<BodyWidgetProps,any> {
	constructor(props: any) {
		super(props);
	}

	componentDidMount(): void {
		this.props.syncDiagram(this.props);
	}

	render() {
		let reduxFunctions = {
			"changeDomain": this.props.setDomain,
			"addDomainNode": this.props.addDomainNode,
			"removeDomainNode": this.props.removeDomainNode,
			"addConstantNode": this.props.addConstantNode,
			"removeConstantNode": this.props.removeConstantNode
		};
		return (
			<Body>
				<Content>
					<TrayWidget>
						<UnbinaryItemWidget model={{type: 'in'}} clickFunction={createNode} element={this}
											name="Pridaj vrchol" color="rgb(192,255,0)"
											reduxFunctions={reduxFunctions}/>
						<UnbinaryItemWidget model={{type: 'unbinary'}} clickFunction={createNode} element={this}
											name="Pridaj unárny/binárny" color="rgb(125,192,125)"
											reduxFunctions={reduxFunctions}/>
						<UnbinaryItemWidget model={{type: 'constant'}} clickFunction={createNode} element={this}
											name="Pridaj unárny/binárny" color="rgb(125,192,125)"
											reduxFunctions={reduxFunctions}/>
						<DiamondItemWidget model={{type: 'diamond'}} clickFunction={createNode} element={this}
										   name="Pridaj diamant" color="rgb(128,96,245)"
										   reduxFunctions={reduxFunctions}/>
					</TrayWidget>
					<Layer
						onDrop={event => {
							createNode(this, event, reduxFunctions, false);
						}}
						onDragOver={event => {
							event.preventDefault();
						}}
					>
						<MainCanvasWidget>
							<CanvasWidget engine={this.props.app.getDiagramEngine()}/>
						</MainCanvasWidget>
					</Layer>
				</Content>
			</Body>
		);
	}
}
