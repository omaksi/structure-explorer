import {BasePositionModelOptions} from "@projectstorm/react-canvas-core";
import {NodeModel, NodeModelGenerics, PortModelAlignment} from "@projectstorm/react-diagrams";
import {UnBinaryPortModel} from "./unbinary/UnBinaryPortModel";
import _ from "lodash";
import {NaryRelationPortModel} from "./NaryRelationPortModel";

export interface BaseNodeModelGenerics {
    PORT: NaryRelationPortModel;
    OPTIONS: BaseNodeModelOptions;
}

export interface BaseNodeModelOptions extends BasePositionModelOptions {
    name?: string;
    color?: string;
    numberOfPorts: number;
    reduxProps:any;
}

export class BaseNodeModel extends NodeModel<NodeModelGenerics & BaseNodeModelGenerics> {
    changeCounter: number;
    editable:boolean;
    predicates: Set<string>;
    functions: Set<string>;
    parameterPorts: Array<any>;

    constructor(options?: BaseNodeModelOptions);
    constructor(options: any = {}) {
        super({
            ...options
        });

        this.changeCounter = 0;
        this.predicates = new Set();
        this.functions = new Set();
        this.parameterPorts = new Array<any>(this.getNumberOfPorts());
        this.editable = this.getReduxProps()["editable"];
        this.registerEvents();
        this.registerParameterPorts();
    }

    registerParameterPorts(){
        let directions = [PortModelAlignment.TOP,PortModelAlignment.LEFT,PortModelAlignment.RIGHT,PortModelAlignment.BOTTOM];
        for(let i = 0;i<this.getNumberOfPorts();i++){
            this.parameterPorts[i] = this.addPort(new NaryRelationPortModel(directions[i]));
        }
    }

    increaseChangeCounter(){
        this.changeCounter+=1;
    }

    getNumberOfPorts(){
        return this.getOptions().numberOfPorts;
    }

    clearPredicates() {
        this.predicates = new Set();
        this.increaseChangeCounter();
    }

    clearFunctions() {
        this.functions = new Set();
        this.increaseChangeCounter();
    }

    getPredicates() {
        return this.predicates;
    }

    getFunctions(){
        return this.functions;
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

    changeEditableState(value:boolean){
        this.editable = value;
    }

    getNodeName() {
        return this.getOptions().name;
    }

    renameNode(name: string) {
        this.getOptions().name = name;
    }

    isEditable():boolean{
        return this.editable;
    }

    addPredicateToSet(name: string){
        this.predicates.add(name);
        this.increaseChangeCounter();
    }

    addFunctionToSet(name: string){
        this.functions.add(name);
        this.increaseChangeCounter();
    }

    removePredicateFromSet(name: string){
        this.predicates.delete(name);
        this.increaseChangeCounter();
    }

    removeFunctionFromSet(name: string){
        this.predicates.delete(name);
        this.increaseChangeCounter();
    }

    removeNodeFromMathView(){
        throw new Error("This method should be implemented in child");
    }

    addPredicate(name:string){
        throw new Error("This method should be implemented in child");
    }

    addFunction(name: string) {
        throw new Error("This method should be implemented in child");
    }

    getReduxProps(){
        return this.getOptions().reduxProps;
    }
}