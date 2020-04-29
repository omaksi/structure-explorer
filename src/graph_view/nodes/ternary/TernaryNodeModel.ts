import {BaseNodeModel, BaseNodeModelOptions} from "../BaseNodeModel";
import {PREDICATE} from "../ConstantNames";

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

	addElementToMathView(name:string,type:string){
		let addElementFunc = type === PREDICATE?this.getReduxProps()["addTernaryPredicate"]:this.getReduxProps()["addBinaryFunction"];
		addElementFunc(name,this.getNodeNameCombination());
	}
}
