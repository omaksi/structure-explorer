import {BaseNodeModel, BaseNodeModelOptions} from "../BaseNodeModel";
import {PREDICATE} from "../ConstantNames";

export class QuaternaryNodeModel extends BaseNodeModel {

	constructor(options?: BaseNodeModelOptions);
	constructor(options: any = {}) {
		super({
			type: 'quaternary',
			...options
		});
	}

	removeElementFromMathView(name: string, type: string) {
		let removeElementFunction = type === PREDICATE?this.getReduxProps()["removeQuaternaryPredicate"]:this.getReduxProps()["removeTernaryFunction"];
		removeElementFunction(name,this.getNodeNameCombination());
	}

	addElementToMathView(name:string,type:string){
		let addElementFunction = type === PREDICATE?this.getReduxProps()["addQuaternaryPredicate"]:this.getReduxProps()["addTernaryFunction"];
		addElementFunction(name,this.getNodeNameCombination());
	}

	removeNodeFromGraphView(){
		this.getReduxProps()["removeQuaternaryNode"](this.getNodeName());
	}
}
