import {BaseNodeModel, BaseNodeModelOptions} from "../BaseNodeModel";

export class TernaryNodeModel extends BaseNodeModel {

	constructor(options?: BaseNodeModelOptions);
	constructor(options: any = {}) {
		super({
			type: 'ternary',
			...options
		});
	}

	removeNodeFromMathView(){
	}
}
