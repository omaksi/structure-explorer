import * as React from 'react';
import { TrayWidget } from './TrayWidget';
import {QuaternaryItemWidget, UnbinaryItemWidget} from './TrayItemWidget';
import { DefaultNodeModel} from '@projectstorm/react-diagrams';
import { CanvasWidget} from '@projectstorm/react-canvas-core';
import { MainCanvasWidget} from './MainCanvasWidget';
import styled from '@emotion/styled';
import {UnBinaryNodeModel} from "../nodes/unbinary/UnBinaryNodeModel";
import {ConstantNodeModel} from "../nodes/constant/ConstantNodeModel";
import {QuaternaryNodeModel} from "../nodes/quaternary/QuaternaryNodeModel";
import {TernaryNodeModel} from "../nodes/ternary/TernaryNodeModel";
import FontAwesome from "react-fontawesome";

export interface BodyWidgetProps {
	renameDomainNode:any;
	syncDiagram:any;
	addDomainNode:any;
	removeDomainNode:any;
	addConstantNode:any;
	removeConstantNode:any;
	diagramState:any;
	checkBadName:any;
	addUnaryPredicate:any;
	removeUnaryPredicate:any;
	toggleEditableNodes:any;
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


	function getAvailableCount(nodeType:string,diagramState:any):number {
		let nodeCount = 0;
		let state:Map<string,object>;
		if (nodeType === 'unbinary') {
			state = diagramState.domainNodes;
			}

		else if(nodeType === 'constant'){
			state = diagramState.constantNodes;
		}

		else{
			state = diagramState.functionNodes;
		}

		while(state.has('Node'+nodeCount)){
			nodeCount++;
		}
		return nodeCount;
	}

	function createNode(element:any,event:any,reduxProps:any,clicked:boolean=true) {
		let data;
		if (clicked) {
			data = JSON.parse(event);
		} else {
			data = JSON.parse(event.dataTransfer.getData('storm-graph_view-node'));
		}

		let nodesCount = getAvailableCount(data.type,element.props.diagramState);

		let node: any;
		if (data.type === 'unbinary') {
			node = new UnBinaryNodeModel('Node' + nodesCount, 'rgb(92,192,125)', reduxProps);
			reduxProps.addDomainNode(node.getOptions().name,node);

		} else if (data.type === 'constant') {
			node = new ConstantNodeModel('Node' + nodesCount, 'rgb(92,192,125)', reduxProps);
			reduxProps.addConstantNode(node.getOptions().name,node);
		}

		else if(data.type === 'ternary'){
			node = new TernaryNodeModel();
		}

		else if (data.type === 'quaternary') {
			node = new QuaternaryNodeModel();
		}

		else {
			node = new DefaultNodeModel('Node' + nodesCount, 'rgb(0,192,255)');
			node.addOutPort('Out');
		}

		if(node === null){
			throw new DOMException("Node cannot be null, possible leak of unknown type");
		}

		let point;

		let diagramEngine = element.props.diagramState.diagramEngine;

		if (clicked) {
			let canvasWidth = diagramEngine.getCanvas().clientWidth;
			let canvasHeight = diagramEngine.getCanvas().clientHeight;
			point = {x: Math.random()*(canvasWidth-canvasWidth*0.1)+canvasWidth*0.05, y: Math.random()*(canvasHeight-canvasHeight*0.2)+canvasHeight*0.05};
		} else {
			point = diagramEngine.getRelativeMousePoint(event);
		}

		node.setPosition(point);
		diagramEngine.getModel().addNode(node);
		element.forceUpdate();
	}



export class BodyWidget extends React.Component<BodyWidgetProps,any> {
	constructor(props: any) {
		super(props);
	}

	componentDidMount(): void {
		this.props.syncDiagram(this.props); //toto by malo byt zavolane predtym, inak to nerenderuje a new DiagramApplication dostava stary stav
	}

	render() {
		let editableNodes = this.props.diagramState.editableNodes;
		let editableNodesFunction = this.props.toggleEditableNodes;

		let reduxProps = {
			"renameDomainNode": this.props.renameDomainNode,
			"addDomainNode": this.props.addDomainNode,
			"removeDomainNode": this.props.removeDomainNode,
			"addConstantNode": this.props.addConstantNode,
			"removeConstantNode": this.props.removeConstantNode,
			"checkBadName":this.props.checkBadName,
			"addUnaryPredicate":this.props.addUnaryPredicate,
			"removeUnaryPredicate":this.props.removeUnaryPredicate,
			"editableNodes":editableNodes
		};

		return (
			<Body>
				<Content>
					<TrayWidget>
						<button className={"btn btn-outline-primary "+(editableNodes.editable?"":"active")} onClick={(e) => {editableNodesFunction(false);this.forceUpdate()}}><FontAwesome name={"fas fa-arrows-alt"}/></button>
						<button className={"btn btn-outline-primary "+(editableNodes.editable?"active":"")} onClick={(e) => {editableNodesFunction(true);this.forceUpdate()}}><FontAwesome name={"fas fa-edit"}/></button>

						<UnbinaryItemWidget model={{type: 'in'}} clickFunction={createNode} element={this}
											name="Pridaj vrchol" color="rgb(192,255,0)"
											reduxProps={reduxProps}/>
						<UnbinaryItemWidget model={{type: 'unbinary'}} clickFunction={createNode} element={this}
											name="Pridaj unárny/binárny" color="rgb(125,192,125)"
											reduxProps={reduxProps}/>
						<UnbinaryItemWidget model={{type: 'constant'}} clickFunction={createNode} element={this}
											name="Pridaj unárny/binárny" color="rgb(125,192,125)"
											reduxProps={reduxProps}/>
						<QuaternaryItemWidget model={{type: 'quaternary'}} clickFunction={createNode} element={this}
										   name="Pridaj stvornarny" color="rgb(128,96,245)"
										   reduxProps={reduxProps}/>
						<QuaternaryItemWidget model={{type: 'ternary'}} clickFunction={createNode} element={this}
											  name="Pridaj ternary" color="rgb(128,96,245)"
											  reduxProps={reduxProps}/>
					</TrayWidget>
					<Layer
						onDrop={event => {
							createNode(this, event, reduxProps, false);
						}}
						onDragOver={event => {
							event.preventDefault();
						}}
					>
						<MainCanvasWidget>
							<CanvasWidget engine={this.props.diagramState.diagramEngine}/>
						</MainCanvasWidget>
					</Layer>
				</Content>
			</Body>
		);
	}
}
