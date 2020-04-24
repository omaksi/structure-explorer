import {BaseNodeModel, BaseNodeModelOptions} from "../BaseNodeModel";

export class QuaternaryNodeModel extends BaseNodeModel {

	constructor(options?: BaseNodeModelOptions);
	constructor(options: any = {}) {
		super({
			type: 'quaternary',
			...options
		});
	}

	removeNodeFromMathView(){
	}
}
