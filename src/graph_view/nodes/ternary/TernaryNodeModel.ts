import {PortModelAlignment } from '@projectstorm/react-diagrams';
import {TernaryPortModel} from "./TernaryPortModel";
import {BasicNodeModel, BasicNodeModelOptions} from "../BasicNodeModel";

export class TernaryNodeModel extends BasicNodeModel {

	constructor(options?: BasicNodeModelOptions);
	constructor(options: any = {}) {
		super({
			type: 'ternary',
			...options
		});
	}

	removeNodeFromMathView(){
		console.log("calling this");
	}
}
