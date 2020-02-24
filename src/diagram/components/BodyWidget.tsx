import * as React from 'react';
import * as _ from 'lodash';
import { TrayWidget } from './TrayWidget';
import { Application } from '../Application';
import {DiamondItemWidget, UnbinaryItemWidget} from './TrayItemWidget';
import { DefaultNodeModel } from '@projectstorm/react-diagrams';
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import { MainCanvasWidget } from './MainCanvasWidget';
import styled from '@emotion/styled';
import {DiamondNodeModel} from "../nodes/DiamondNode/DiamondNodeModel";
import {UnBinaryNodeModel} from "../nodes/UnBinaryNode/UnBinaryNodeModel";

export interface BodyWidgetProps {
	app: Application;
	setDomain:any;
	changeDomain:any;
	syncDiagram:any;
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

	function createNode(element:any,event:any,setDomain:any,changeDomain:any,clicked:boolean=true){
		let data;
		if(clicked){
			data = JSON.parse(event);
		}
		else{
			data = JSON.parse(event.dataTransfer.getData('storm-diagram-node'));
		}

		let nodesCount = _.keys(
			element.props.app
				.getDiagramEngine()
				.getModel()
				.getNodes()
		).length;

		let node: any = null;
		if (data.type === 'diamond') {
			node = new DiamondNodeModel();
		}
		else if (data.type === 'unbinary') {
			node = new UnBinaryNodeModel('Node' + (nodesCount + 1),'rgb(92,192,125)',setDomain,changeDomain);
		}
		else{
			node = new DefaultNodeModel('Node' + (nodesCount + 1), 'rgb(0,192,255)');
			node.addOutPort('Out');
		}

		let point;

		if(clicked){
			point = {x:200,y:50};
		}
		else{
			point = element.props.app.getDiagramEngine().getRelativeMousePoint(event);
		}

		node.setPosition(point);
		element.props.app
			.getDiagramEngine()
			.getModel()
			.addNode(node);
		element.forceUpdate();
	}



export class BodyWidget extends React.Component<BodyWidgetProps,any> {
		constructor(props:any){
			super(props);

		}

		componentDidMount(): void {
			this.props.syncDiagram(this.props);
		}

	render() {
		return (
			<Body>
				<Content>
					<TrayWidget>
						<UnbinaryItemWidget model={{ type: 'in' }} clickFunction={createNode} element={this} name="Pridaj vrchol" color="rgb(192,255,0)" setDomain={this.props.setDomain} changeDomain={this.props.changeDomain}/>
						<UnbinaryItemWidget model={{ type: 'unbinary' }} clickFunction={createNode} element={this} name="Pridaj unárny/binárny" color="rgb(125,192,125)" setDomain={this.props.setDomain} changeDomain={this.props.changeDomain}/>
						<DiamondItemWidget model={{ type: 'diamond' }} clickFunction={createNode} element={this} name="Pridaj diamant" color="rgb(128,96,245)" setDomain={this.props.setDomain} changeDomain={this.props.changeDomain}/>
					</TrayWidget>
					<Layer
						onDrop={event => {
							createNode(this,event,this.props.setDomain,this.props.changeDomain,false);
						}}
						onDragOver={event => {
							event.preventDefault();
						}}
						>
						<MainCanvasWidget>
							<CanvasWidget engine={this.props.app.getDiagramEngine()} />
						</MainCanvasWidget>
					</Layer>
				</Content>
			</Body>
		);
	}
}
