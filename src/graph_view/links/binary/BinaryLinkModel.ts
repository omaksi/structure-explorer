import {
	LabelModel,
	LinkModel,
	LinkModelGenerics,
	LinkModelListener,
	PortModel,
	PortModelAlignment
} from '@projectstorm/react-diagrams-core';
import { BezierCurve } from '@projectstorm/geometry';
import { BaseEntityEvent, BaseModelOptions, DeserializeEvent } from '@projectstorm/react-canvas-core';
import {BinaryLabelModel} from "../../labels/binary/BinaryLabelModel";
import {UnBinaryNodeModel} from "../../nodes/unbinary/UnBinaryNodeModel";
import {ConstantNodeModel} from "../../nodes/constant/ConstantNodeModel";
import {ConstantPortModel} from "../../nodes/constant/ConstantPortModel";
import {BASIC_CURVYNESS} from "../../nodes/ConstantNames";
import {BaseNodeModel} from "../../nodes/BaseNodeModel";
import {TernaryNodeModel} from "../../nodes/ternary/TernaryNodeModel";
import {QuaternaryNodeModel} from "../../nodes/quaternary/QuaternaryNodeModel";
import {NaryRelationPortModel} from "../../nodes/NaryRelationPortModel";

export interface BinaryLinkModelListener extends LinkModelListener {
	// @ts-ignore
	colorChanged?(event: BaseEntityEvent<BinaryLinkModel> & { color: null | string }): void;

	// @ts-ignore
	widthChanged?(event: BaseEntityEvent<BinaryLinkModel> & { width: 0 | number }): void;

	// @ts-ignore
	entityRemoved?(event: BaseEntityEvent<BinaryLinkModel>): void;
}

export interface BinaryLinkModelOptions extends BaseModelOptions {
	width?: number;
	color?: string;
	selectedColor?: string;
	curvyness?: number;
	type?: string;
	testName?: string;
}

export interface BinaryLinkModelGenerics extends LinkModelGenerics {
	LISTENER: BinaryLinkModelListener;
	OPTIONS: BinaryLinkModelOptions;
}

export class BinaryLinkModel extends LinkModel<BinaryLinkModelGenerics> {
	label:BinaryLabelModel;
	callReduxFunc:boolean;
	changeCounter: number;

	constructor(options: BinaryLinkModelOptions = {},canCallReduxFunc:boolean = true) {
		super({
			type: 'binary',
			width: options.width || 3,
			color: options.color || 'gray',
			selectedColor: options.selectedColor || 'rgb(0,192,255)',
			curvyness: 0,
			...options
		});

		this.changeCounter = 0;
		this.callReduxFunc = canCallReduxFunc;
		let link:BinaryLinkModel = this;
		let removeLinkIfCondition = (port:PortModel,link:LinkModel) =>{
			let numberOfLinks: number = Object.keys(port.getLinks()).length;
			if (numberOfLinks > 1) {
				for (let linkObject of Object.values(port.getLinks())) {
					if (linkObject !== link) {
						linkObject.remove();
					}
				}
			}
		};
		// @ts-ignore
		this.registerListener({
			targetPortChanged(event: BaseEntityEvent<LinkModel> & { port: PortModel | null }): void {
				if (link.getTargetPort() === null) {
					return;
				}

				let sourceNode = link.getSourcePort().getNode();
				let targetNode = link.getTargetPort().getNode();

				if (sourceNode instanceof UnBinaryNodeModel && targetNode instanceof UnBinaryNodeModel) {
					if(sourceNode === targetNode) {
						link.getOptions().curvyness = BASIC_CURVYNESS;
						}
					link.label = new BinaryLabelModel({},sourceNode.getOptions().reduxProps,sourceNode.getNodeName()+" - "+targetNode.getNodeName());
					link.addLabel(link.label);
					return;

				} else if ((sourceNode instanceof UnBinaryNodeModel && targetNode instanceof ConstantNodeModel) || (targetNode instanceof UnBinaryNodeModel && sourceNode instanceof ConstantNodeModel)) {
					let constantNode: ConstantNodeModel = sourceNode instanceof ConstantNodeModel ? sourceNode : targetNode instanceof ConstantNodeModel ? targetNode : null;
					let unbinaryNode: UnBinaryNodeModel = sourceNode instanceof UnBinaryNodeModel ? sourceNode : targetNode instanceof UnBinaryNodeModel ? targetNode : null;

					let constantPort: ConstantPortModel = constantNode.getMainPort();

					if (constantPort === null || constantPort === undefined) {
						throw new Error("Constant port can not be null, probably problem in initialization");
					}

					removeLinkIfCondition(constantPort,link);

					//When link is created through Redux Action, another Action would be called and error would be thrown, so if it is created with some Redux Action we will not allow this Action to be dispatched
					if(link.isCallReduxFunc()){
						constantNode.setConstantValueInMathView(unbinaryNode.getNodeName());
					}
					else{
						link.setCallReduxFunc(true);
					}
				}

				else if((sourceNode instanceof UnBinaryNodeModel && (targetNode instanceof TernaryNodeModel || targetNode instanceof QuaternaryNodeModel)) || ((sourceNode instanceof TernaryNodeModel || sourceNode instanceof QuaternaryNodeModel) && targetNode instanceof UnBinaryNodeModel)){
					let unbinaryNode: UnBinaryNodeModel = sourceNode instanceof UnBinaryNodeModel ? sourceNode : targetNode instanceof UnBinaryNodeModel ? targetNode : null;
					let naryNode:BaseNodeModel = (sourceNode instanceof TernaryNodeModel || sourceNode instanceof QuaternaryNodeModel)?sourceNode:(targetNode instanceof TernaryNodeModel || targetNode instanceof QuaternaryNodeModel)?targetNode:null;
					let naryPort: NaryRelationPortModel = link.getSourcePort() instanceof NaryRelationPortModel?link.getSourcePort():link.getTargetPort() instanceof NaryRelationPortModel?link.getTargetPort():null;
					let previousCombination:string = naryNode.getNodeNameCombination();

					removeLinkIfCondition(naryPort,link);
					//ak bola predosla kombinacia, tu zmazeme zo struktury
					if(naryNode && previousCombination){

					}
					naryNode.setValueToPort(naryPort,unbinaryNode);
					console.log("here we are");
					if(naryNode.getNodeNameCombination()){
						console.log("yes we have");
						naryNode.representNodeInMathView();
					}
				}
			},

			entityRemoved(event:any): void {
				if(!link.isCallReduxFunc() || !link.getTargetPort()){
					return;
				}

				let sourceNode = link.getSourcePort().getNode();
				let targetNode = link.getTargetPort().getNode();

				let constantNode: ConstantNodeModel = sourceNode  instanceof ConstantNodeModel ? sourceNode : targetNode instanceof ConstantNodeModel ? targetNode : null;
				let naryNode:BaseNodeModel = (sourceNode instanceof TernaryNodeModel || sourceNode instanceof QuaternaryNodeModel)?sourceNode:(targetNode instanceof TernaryNodeModel || targetNode instanceof QuaternaryNodeModel)?targetNode:null;


				if(constantNode){
					constantNode.setConstantValueInMathView("");
				}
				else if(naryNode){
					let naryPort:NaryRelationPortModel = targetNode === naryNode?link.getTargetPort():link.getSourcePort();
					let previousCombination = naryNode.getNodeNameCombination();
					naryNode.removeValueFromPort(naryPort);
					naryNode.removePredFuncFromMathView(previousCombination);
				}
				else{
					if(link.label){
						link.label.remove();
					}
				}
			}
		});
	}

	setCurvyness(num:number){
		this.getOptions().curvyness = num;
	}

	increaseChangeCounter(){
		this.changeCounter+=1;
	}

	setCallReduxFunc(value:boolean){
		this.callReduxFunc = value;
	}

	isCallReduxFunc(){
		return this.callReduxFunc;
	}

	calculateControlOffset(port: PortModel): [number, number] {
		if (port.getOptions().alignment === PortModelAlignment.RIGHT) {
			return [this.options.curvyness, 0];
		} else if (port.getOptions().alignment === PortModelAlignment.LEFT) {
			return [-this.options.curvyness, 0];
		} else if (port.getOptions().alignment === PortModelAlignment.TOP) {
			return [0, -this.options.curvyness];
		}
		return [0, this.options.curvyness];
	}

	getLabel(){
		return this.label;
	}

	getSVGPath(): string {
		if (this.points.length == 2) {
			const curve = new BezierCurve();
			curve.setSource(this.getFirstPoint().getPosition());
			curve.setTarget(this.getLastPoint().getPosition());
			curve.setSourceControl(
				this.getFirstPoint()
					.getPosition()
					.clone()
			);
			curve.setTargetControl(
				this.getLastPoint()
					.getPosition()
					.clone()
			);

			if (this.sourcePort) {
				curve.getSourceControl().translate(...this.calculateControlOffset(this.getSourcePort()));
			}

			if (this.targetPort) {
				curve.getTargetControl().translate(...this.calculateControlOffset(this.getTargetPort()));
			}
			return curve.getSVGCurve();
		}
	}

	clearLabels() {
		if (this.label) {
			let label = new BinaryLabelModel({},this.label.getReduxProps());

			label.changeCounter = this.label.changeCounter;
			label.predicates = this.label.predicates;
			label.editable = this.label.editable;

			this.label.setParent(null);
			delete this.label;

			this.labels = [];

			this.label = label;
		}
	}

	serialize() {
		return {
			...super.serialize(),
			width: this.options.width,
			color: this.options.color,
			curvyness: this.options.curvyness,
			selectedColor: this.options.selectedColor,
			changeCounter: this.changeCounter
		};
	}

	deserialize(event: DeserializeEvent<this>) {
		super.deserialize(event);
		this.options.color = event.data.color;
		this.options.width = event.data.width;
		this.options.curvyness = event.data.curvyness;
		this.options.selectedColor = event.data.selectedColor;
		this.changeCounter = event.data.changeCounter;
	}

	addLabel(label: LabelModel | string) {
		if (label instanceof LabelModel) {
				return super.addLabel(label);
			}
		let labelOb = new BinaryLabelModel();
		labelOb.setLabel(label);
		return super.addLabel(labelOb);
	}

	setWidth(width: number) {
		this.options.width += width;
		this.fireEvent({ width }, 'widthChanged');
	}

	setColor(color: string) {
		this.options.color = color;
		this.fireEvent({ color }, 'colorChanged');
	}

	remove() {
		if (this.sourcePort) {
			this.sourcePort.removeLink(this);
		}
		if (this.targetPort) {
			this.targetPort.removeLink(this);
		}
		super.remove();
	}
}
