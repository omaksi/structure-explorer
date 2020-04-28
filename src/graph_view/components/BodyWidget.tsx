import * as React from 'react';
import { TrayWidget } from './TrayWidget';
import {ItemWidgetIcon} from './TrayItemWidget';
import { CanvasWidget} from '@projectstorm/react-canvas-core';
import { MainCanvasWidget} from './MainCanvasWidget';
import styled from '@emotion/styled';
import {UnBinaryNodeModel} from "../nodes/unbinary/UnBinaryNodeModel";
import {ConstantNodeModel} from "../nodes/constant/ConstantNodeModel";
import {QuaternaryNodeModel} from "../nodes/quaternary/QuaternaryNodeModel";
import {TernaryNodeModel} from "../nodes/ternary/TernaryNodeModel";
import FontAwesome from "react-fontawesome";
import {Button} from 'react-bootstrap';
import {ConstantIcon, QuaternaryIcon, TernaryIcon, UnbinaryIcon} from "./TrayItemWidgetIcon";
import {importDiagramState} from "../../redux/actions";
import {CONSTANTNODE, QUATERNARYNODE, TERNARYNODE, UNBINARYNODE} from "../nodes/ConstantNames";

export interface BodyWidgetProps {
	syncDiagram:any;
	addDomainNode:any;
	addTernaryNode:any;
	addQuaternaryNode:any;
	renameDomainNode:any;
	removeDomainNode:any;
	addConstantNode:any;
	renameConstantNode:any;
	removeConstantNode:any;
	addUnaryPredicate:any;
	addUnaryFunction:any;
	addBinaryPredicate:any;
	addBinaryFunction:any;
	addTernaryPredicate:any;
	addTernaryFunction:any;
	addQuaternaryPredicate:any;
	removeUnaryPredicate:any;
	removeUnaryFunction:any;
	removeBinaryPredicate:any;
	removeBinaryFunction:any;
	removeTernaryPredicate:any;
	removeTernaryFunction:any;
	removeQuaternaryPredicate:any;
	toggleEditableNodes:any;
	setConstantValueFromLink:any;
	changeDirectionOfBinaryRelation:any;
	diagramState:any;
	store:any;
}

	export const Body = styled.div`
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
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
		let nodeCount:number = 0;
		let name: string;
		let state:Map<string,object>;
		if (nodeType === 'unbinary') {
			state = diagramState.domainNodes;
			name = UNBINARYNODE;
			}

		else if(nodeType === 'constant'){
			state = diagramState.constantNodes;
			name = CONSTANTNODE;
		}

		else if(nodeType === 'ternary'){
			state = diagramState.ternaryNodes;
			name = TERNARYNODE;
		}

		else{
			state = diagramState.quaternaryNodes;
			name = QUATERNARYNODE;
		}

		while(state.has(name+nodeCount)){
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
			node = new UnBinaryNodeModel(UNBINARYNODE + nodesCount, 'rgb(92,192,125)', reduxProps);
			reduxProps.addDomainNode(node.getOptions().name,node);

		} else if (data.type === 'constant') {
			node = new ConstantNodeModel(CONSTANTNODE + nodesCount, 'rgb(92,192,125)', reduxProps);
			reduxProps.addConstantNode(node.getOptions().name,node);
		}

		else if(data.type === 'ternary'){
			node = new TernaryNodeModel({name:TERNARYNODE+nodesCount,reduxProps:reduxProps,numberOfPorts:3});
			reduxProps.addTernaryNode(node.getOptions().name,node);
		}

		else if (data.type === 'quaternary') {
			node = new QuaternaryNodeModel({name:QUATERNARYNODE+nodesCount,reduxProps:reduxProps,numberOfPorts:4});
			reduxProps.addQuaternaryNode(node.getOptions().name,node);
		}

		else {
			throw new Error("Node cannot be null, possible leak of unknown type");
		}

		let point;

		let diagramEngine = element.props.diagramState.diagramEngine;

		if (clicked) {
			let canvasWidth = diagramEngine.getCanvas().clientWidth;
			let canvasHeight = diagramEngine.getCanvas().clientHeight;
			point = {x: Math.random()*(canvasWidth-canvasWidth*0.2)+canvasWidth*0.05, y: Math.random()*(canvasHeight-canvasHeight*0.2)+canvasHeight*0.05};
		} else {
			point = diagramEngine.getRelativeMousePoint(event);
		}

		node.setPosition(point);
		diagramEngine.getModel().addNode(node);
		element.forceUpdate();
	}

export class BodyWidget extends React.Component<BodyWidgetProps,any> {
	body: any;
	reduxProps: any;

	constructor(props: any) {
		super(props);
		this.focusOnBodyElement = this.focusOnBodyElement.bind(this);

		this.reduxProps = {
			"addDomainNode": this.props.addDomainNode,
			"addConstantNode": this.props.addConstantNode,
			"addTernaryNode": this.props.addTernaryNode,
			"addQuaternaryNode": this.props.addQuaternaryNode,
			"renameDomainNode": this.props.renameDomainNode,
			"removeDomainNode": this.props.removeDomainNode,
			"renameConstantNode": this.props.renameConstantNode,
			"removeConstantNode": this.props.removeConstantNode,
			"addUnaryPredicate": this.props.addUnaryPredicate,
			"addUnaryFunction": this.props.addUnaryFunction,
			"addBinaryPredicate": this.props.addBinaryPredicate,
			"addBinaryFunction" : this.props.addBinaryFunction,
			"addTernaryPredicate": this.props.addTernaryPredicate,
			"addTernaryFunction" : this.props.addTernaryFunction,
			"addQuaternaryPredicate": this.props.addQuaternaryPredicate,
			"removeUnaryPredicate": this.props.removeUnaryPredicate,
			"removeUnaryFunction": this.props.removeUnaryFunction,
			"removeBinaryPredicate": this.props.removeBinaryPredicate,
			"removeBinaryFunction" : this.props.removeBinaryFunction,
			"removeTernaryPredicate" : this.props.removeTernaryPredicate,
			"removeTernaryFunction" : this.props.removeTernaryFunction,
			"removeQuaternaryPredicate": this.props.removeQuaternaryPredicate,
			"setConstantValueFromLink": this.props.setConstantValueFromLink,
			"changeDirectionOfBinaryRelation": this.props.changeDirectionOfBinaryRelation,
			"focusOnBodyElement": this.focusOnBodyElement,
			"editable": this.props.diagramState.editableNodes,
			"store": this.props.store,
		};
	}

	componentDidMount(): void {
		if(this.props.diagramState.imported) {
			this.props.store.dispatch(importDiagramState(this.props.store.getState()));
		}
		else{
			this.props.syncDiagram(this.props,this.focusOnBodyElement);
		}
		this.focusOnBodyElement();
	}
	componentDidUpdate(): void {
		if(this.props.diagramState.imported){
			this.props.store.dispatch(importDiagramState({...this.props.store.getState(),...this.reduxProps},this.focusOnBodyElement));
		}
	}

	focusOnBodyElement(){
		if(this.body){
			this.body.focus();
		}
	}

	render() {
		let editableNodes = this.props.diagramState.editableNodes;
		let editableNodesFunction = this.props.toggleEditableNodes;

		return (
			<Body ref={Body => this.body = Body} tabIndex={1} onKeyPress={(e: any) => {
				let exclude = ['input', 'textarea'];
				if (!exclude.includes(e.target.tagName.toLowerCase())) {
					if (e.key === ';' || e.key === '`') {
						editableNodes ? editableNodesFunction(false) : editableNodesFunction(true);
					} else if (e.key.toLowerCase() === 'p') {
						editableNodesFunction(false);
					} else if (e.key.toLowerCase() === 'e') {
						editableNodesFunction(true);
					}
				}
			}}
				  onKeyDown={(e:any) => {
					  if (e.key === "Escape") {
						  this.props.diagramState.diagramEngine.getModel().clearSelection();
						  this.props.diagramState.diagramEngine.repaintCanvas();
					  }
				  }}
			>
				<Content>
					<TrayWidget>
						<Button title={"Pohyb po grafe (P)"} variant={"outline-primary"}
								className={editableNodes ? "" : "active"} onClick={() => {
							editableNodesFunction(false)
						}}><FontAwesome name={"fas fa-arrows-alt"}/></Button>
						<Button title={"Editovanie grafu (E)"} variant={"outline-primary"}
								className={editableNodes ? "active" : ""} onClick={() => {
							editableNodesFunction(true)
						}}><FontAwesome name={"fas fa-edit"}/></Button>

						<ItemWidgetIcon model={{type: 'unbinary'}} clickFunction={createNode} element={this}
										name="Pridaj unárny/binárny" color="rgb(125,192,125)"
										reduxProps={this.reduxProps}
										title={"Pridať vrchol, ktorý predstavuje prvok domény. Tomuto prvku je možné následne pridať unárne predikáty a vytvarať binárne väzby"}
										children={<UnbinaryIcon/>}
						/>
						<ItemWidgetIcon model={{type: 'constant'}} clickFunction={createNode} element={this}
										name="Pridaj konštantu" color="rgb(125,192,125)"
										reduxProps={this.reduxProps}
										title={"Pridať vrchol, ktorý predstavuje konštanty. Vytvorením linky priradíme konštante prvok domény"}
										children={<ConstantIcon/>}
						/>

						<ItemWidgetIcon model={{type: 'ternary'}} clickFunction={createNode} element={this}
										name= "Pridaj ternárny" color="rgb(128,96,245)"
										reduxProps={this.reduxProps}
										title={"Pridať vrchol, ktorý predstavuje ternárny vzťah pre predikáty a binárny vzťah pre funkcie"}
										children={<TernaryIcon/>}
						/>

						<ItemWidgetIcon model={{type: 'quaternary'}} clickFunction={createNode} element={this}
										name="Pridaj štvornárny" color="rgb(128,96,245)"
										reduxProps={this.reduxProps}
										title={"Pridať vrchol, ktorý predstavuje quaternárny vzťah pre predikáty a ternárny vzťah pre funkcie"}
										children={<QuaternaryIcon/>}
						/>

					</TrayWidget>
					<Layer
						onDrop={event => {
							createNode(this, event, this.reduxProps, false);
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
