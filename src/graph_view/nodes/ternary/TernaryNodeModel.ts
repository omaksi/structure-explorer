import { NodeModel, NodeModelGenerics, PortModelAlignment } from '@projectstorm/react-diagrams';
import {TernaryPortModel} from "./TernaryPortModel";
import {UnBinaryPortModel} from "../unbinary/UnBinaryPortModel";
import _ from "lodash";
import {BasePositionModelOptions} from "@projectstorm/react-canvas-core";

export interface QuaternaryNodeModelGenerics {
	PORT: TernaryPortModel;
	OPTIONS: TernaryNodeModelOptions;
}

export interface TernaryNodeModelOptions extends BasePositionModelOptions {
	name?: string;
	color?: string;
	numberOfPorts: number;
	reduxProps:any;
	domainNodeName:any;
}

export class TernaryNodeModel extends NodeModel<NodeModelGenerics & QuaternaryNodeModelGenerics> {
	changeCounter: number;
	editable:boolean;
	predicates: Map<string,string>;
	functions: Map<string,string>;

	constructor(options?: TernaryNodeModelOptions);
	constructor(options: any = {}, reduxProps?:any,name?:string) {
		if (typeof options === 'string') {
			options = {
				name: options,
				reduxProps: reduxProps
			};
		}
		super({
			type: 'ternary',
			reduxProps: reduxProps,
			name:name,
			numberOfPorts: 3,
			...options
		});

		this.changeCounter = 0;
		this.predicates = new Map();
		this.functions = new Map();

		this.addPort(new TernaryPortModel(PortModelAlignment.TOP));
		this.addPort(new TernaryPortModel(PortModelAlignment.LEFT));
		this.addPort(new TernaryPortModel(PortModelAlignment.RIGHT));
	}

	increaseChangeCounter(){
		this.changeCounter+=1;
	}

	removePort(port: UnBinaryPortModel): void {
		for (let link of _.values(port.getLinks())) {
			link.remove();
		}
		//clear the parent node reference
		if (this.ports[port.getName()]) {
			this.ports[port.getName()].setParent(null);
			delete this.ports[port.getName()];
		}
	}

	serialize() {
		return {
			...super.serialize(),
			changeCounter: this.changeCounter,
			editable: this.editable
		};
	}

	deserialize(event: any) {
		super.deserialize(event);
		this.changeCounter = event.date.changeCounter;
		this.editable = event.data.editable;
	}

	registerEvents() {
		let node = this;
		this.registerListener({
			entityRemoved(): void {
				node.removeNodeFromMathView();
			}
		})
	}

	removeNodeFromMathView(){
		//IMPLEMENT
	}
}
