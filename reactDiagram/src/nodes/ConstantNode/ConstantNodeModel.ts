import {NodeModel, NodeModelGenerics} from '@projectstorm/react-diagrams';
import { BasePositionModelOptions } from '@projectstorm/react-canvas-core';
import { ConstantPortModel } from './ConstantPortModel';

export interface ConstantNodeModelGenerics {
	PORT: ConstantPortModel;
	OPTIONS: ConstantNodeModelOptions;
}

export interface ConstantNodeModelOptions extends BasePositionModelOptions {
	name?: string;
	color?: string;
}

export class ConstantNodeModel extends NodeModel<NodeModelGenerics & ConstantNodeModelGenerics>{
	numberOfPorts:number;
		constructor(name: string, color: string);
		constructor(options?: ConstantNodeModelOptions);
		constructor(options: any = {}, color?: string) {
			if (typeof options === 'string') {
				options = {
					name: options,
					color: color
				};
			}
			super({
				type: 'unbinary',
				name: 'Untitled',
				color: 'rgb(92,192,125)',
				...options
			});
			this.addNewPort("+");
			this.numberOfPorts = 0;

			//this.addPort(new UnBinaryPortModel("name"));
		}

		addNewPort(name:string){
			let port:ConstantPortModel = new ConstantPortModel((name));
			console.log(port.getName());
			this.numberOfPorts+=1;
			this.addPort(port);
		}
}
