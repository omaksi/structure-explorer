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

	removeElementFromMathView(name: string, type: string) {
		let removeElementFunction = type === PREDICATE?this.getReduxProps()["removeTernaryPredicate"]:this.getReduxProps()["removeBinaryFunction"];
		removeElementFunction(name,this.getNodeNameCombination());
	}

	addElementToMathView(name:string,type:string){
		let addElementFunction = type === PREDICATE?this.getReduxProps()["addTernaryPredicate"]:this.getReduxProps()["addBinaryFunction"];
		addElementFunction(name,this.getNodeNameCombination());
	}
}
