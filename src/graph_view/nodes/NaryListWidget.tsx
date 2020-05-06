import * as React from "react";
import {Element, ElementRowContainer} from "../labels/binary/BinaryLabelWidget";
import FontAwesome from "react-fontawesome";
import {PREDICATE} from "./ConstantNames";
import {DiagramEngine} from "@projectstorm/react-diagrams";
import {BaseNodeModel} from "./BaseNodeModel";
import {Button} from "react-bootstrap";

export interface NaryListWidgetProps {
    model: BaseNodeModel;
    engine: DiagramEngine;
    type: string;
    elementName: string;
}

export class NaryListWidget extends React.Component<NaryListWidgetProps> {
    constructor(props: any) {
        super(props);
    }

    render(){
        return (
            <ElementRowContainer key={this.props.elementName} >
                <Element title={this.props.type===PREDICATE?"Predikát":"Funkcia"}>
                    {this.props.elementName}
                </Element>
                <Button className={'btn-graph'} variant={"outline-warning"} title={"Zmazať "+(this.props.type===PREDICATE?"daný predikát":"danú funkciu")+" z vrcholu"} onClick={() =>{
                    this.props.type===PREDICATE?this.props.model.removePredicate(this.props.elementName):this.props.model.removeFunction(this.props.elementName);
                    this.props.engine.repaintCanvas();
                }}><FontAwesome name={"fas fa-trash"}/></Button>
            </ElementRowContainer>
        )
    }
}