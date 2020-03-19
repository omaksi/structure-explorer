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

	constructor(options: BinaryLinkModelOptions = {}) {
		super({
			type: 'binary',
			width: options.width || 3,
			color: options.color || 'gray',
			selectedColor: options.selectedColor || 'rgb(0,192,255)',
			curvyness: 65,
			...options
		});

		let link = this;
		// @ts-ignore
		this.registerListener({
			targetPortChanged(event: BaseEntityEvent<LinkModel> & { port: PortModel | null }): void {
				if (link.getTargetPort() === null) {
					return;
				}

				let sourceNode = link.getSourcePort().getNode();
				let targetNode = link.getTargetPort().getNode();

				if (sourceNode instanceof UnBinaryNodeModel && targetNode instanceof UnBinaryNodeModel) {
					link.label = new BinaryLabelModel();
					link.addLabel(link.label);

				} else if ((sourceNode instanceof UnBinaryNodeModel && targetNode instanceof ConstantNodeModel) || (targetNode instanceof UnBinaryNodeModel && sourceNode instanceof ConstantNodeModel)) {
					let constantNode: ConstantNodeModel = sourceNode instanceof ConstantNodeModel ? sourceNode : targetNode instanceof ConstantNodeModel ? targetNode : null;
					let unbinaryNode: UnBinaryNodeModel = sourceNode instanceof UnBinaryNodeModel ? sourceNode : targetNode instanceof UnBinaryNodeModel ? targetNode : null;

					let constantPort: ConstantPortModel = constantNode.getConstantPort();

					if (constantPort === null || constantPort === undefined) {
						throw new DOMException("Constant port can not be null, probably problem in initialization");
					}

					let numberOfLinks: number = Object.keys(constantPort.getLinks()).length;

					if (numberOfLinks > 1) {
						for (let [linkKeyName, linkObject] of Object.entries(constantPort.getLinks())) {
							if (linkObject !== link) {
								/*linkObject.getSourcePort().removeLink(linkObject);
								linkObject.getTargetPort().removeLink(linkObject);*/
								linkObject.remove();
							}
						}
					}

					if (sourceNode === constantNode) {
						if (link.getTargetPort() === unbinaryNode.getInPort()) {
							return;
						} else {

							console.log("constant port after added link",link.getSourcePort());
							link.setSourcePortWithoutEvent(constantPort);
							link.setTargetPortWithoutEvent(unbinaryNode.getInPort());


							console.log(constantPort);
							//link.setSourcePort(constantPort); //calling setSource to the same port is causing strange behaviour and will unmount a link from the source port
							console.log("link after target port",link.getSourcePort());

							/*let newLink = new BinaryLinkModel();
							newLink.setSourcePortWithoutEvent(constantPort);
							newLink.setTargetPortWithoutEvent(unbinaryNode.getInPort());*/
							return;
						}
					}

					else {
						/*link.remove();

						let newLink = new BinaryLinkModel();
						newLink.setSourcePort(constantPort);
						newLink.setTargetPortWithoutEvent(unbinaryNode.getInPort());
						console.log(newLink);*/
						return;

					}
				}
			}
		});
	}


	setSourcePortWithoutEvent(port: PortModel) {
		if (port !== null) {
			port.addLink(this);
		}
		if (this.sourcePort !== null) {
			this.sourcePort.removeLink(this);
		}
		this.sourcePort = port;
	}

	setTargetPortWithoutEvent(port: PortModel) {
		if (port !== null) {
			port.addLink(this);
		}
		if (this.targetPort !== null) {
			this.targetPort.removeLink(this);
		}
		this.targetPort = port;
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

	clearLabels(){
		for(let i = 0;i<this.getLabels().length;i++)
		{
			this.getLabels()[i].setParent(null);
			console.log("cleared");
			delete this.getLabels()[i];
		}
		this.labels = [];
	}

	serialize() {
		return {
			...super.serialize(),
			width: this.options.width,
			color: this.options.color,
			curvyness: this.options.curvyness,
			selectedColor: this.options.selectedColor
		};
	}

	deserialize(event: DeserializeEvent<this>) {
		super.deserialize(event);
		this.options.color = event.data.color;
		this.options.width = event.data.width;
		this.options.curvyness = event.data.curvyness;
		this.options.selectedColor = event.data.selectedColor;
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
		console.log("SET WIDTH");
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
