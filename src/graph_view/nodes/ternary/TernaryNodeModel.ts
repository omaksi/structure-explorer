import {BaseNodeModel, BaseNodeModelOptions} from "../BaseNodeModel";
import {NaryRelationPortModel} from "../NaryRelationPortModel";

export class TernaryNodeModel extends BaseNodeModel {

	constructor(options?: BaseNodeModelOptions);
	constructor(options: any = {}) {
		super({
			type: 'ternary',
			...options
		});
	}

	removeNodeFromMathView(){
		let nodeCombination:string = this.getNodeNameCombination();
		if(nodeCombination){

		}
	}
}
