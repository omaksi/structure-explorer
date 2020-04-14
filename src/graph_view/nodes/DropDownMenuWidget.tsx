import styled from "@emotion/styled";
import _ from 'lodash';
import * as React from 'react';
import FontAwesome from "react-fontawesome";
import { DiagramEngine } from "@projectstorm/react-diagrams";
import {ADDPORT} from "./ConstantNames";
import {canUsePredicateForGivenArity, getAvailablePredicatesForGivenArity} from "./functions";
import {BinaryLabelModel} from "../labels/binary/BinaryLabelModel";

export const DropDownModel = styled.div<{pointerEvents: string, cursor:string}>`
		width: 100%;
		pointer-events: ${p => p.pointerEvents};
		cursor: ${p => p.cursor};
		background-color: green;
		border-radius: 5px;
		font-family: sans-serif;
		font-weight: bold;
		color: black;
		overflow: visible;
		font-size: 13px;
		border: solid 2px black;
	`;

export const DropDownPorts = styled.div`
		display: flex;
		background-image: linear-gradient(rgba(256, 256, 256, 0.9), rgba(256, 256, 256, 0.9));
	`;

export const DropDownTitleName = styled.div`
		width: 100%;
		flex-grow: 1;
		padding: 5px 5px;
				
		&:hover {
			background: rgba(256, 256, 256, 0.7);
		}
	`;

export const DropDownButton = styled.div`
		outline: none;
		cursor: pointer;
		height: 20px;
		background: rgba(white, 0.1);
		color: black;
		text-align:center;
		padding-left:0.2em;
		padding-right:0.2em;
		
		&:hover {
			background: #00ff80;
		}
	`;

export const DropDownContainer = styled.div`
		width: auto;
		display: flex;
		flex-direction: column;
		flex: 1 0 0;
	`;

export const DropDownInputElement = styled.div`
		width: 100%;
		flex-grow: 1;
		padding: 3px 3px;
	`;

export const DropDownRowContainer = styled.div`
		display: flex;
		flex-direction: row;
		flex: 1 0 0;
	`;

export const DropDownLanguageElement = styled.div`
		min-width: 2em;
		width: 100%;
		height: 20px;
		background: rgba(white, 0.1);
		color: black;
		text-align:center;
	`;


export interface DropDownMenuWidgetProps {
    model: any;
    engine: DiagramEngine;
    badNameForLanguageElement:boolean;
    setStateBadNameForLanguageElement:any;
    setStateInputElementTextLength:any;
    widthOfInputElement:number;
    modelName?:string;
    arity:string;
}

export class DropDownMenuWidget extends React.Component<DropDownMenuWidgetProps> {
    textInput:HTMLInputElement;

    constructor(props:DropDownMenuWidgetProps) {
        super(props);
    }

    checkBadElementName(elementName:string,arity:string){
        elementName = elementName.replace(/\s/g, "");

        if(elementName === "" || elementName.includes(",") || elementName.includes("/")){
            this.props.setStateBadNameForLanguageElement(true);
            return;
        }
        this.props.setStateBadNameForLanguageElement(!canUsePredicateForGivenArity(elementName,arity,this.props.model.getReduxProps()));
    }

    generateAvailablePredicate = (predicate: string) => {
        return (
            <DropDownRowContainer key={predicate} >
                <DropDownLanguageElement onClick={() =>{
                    this.props.model.addPredicate(predicate);
                    this.props.engine.repaintCanvas();
                }}>
                    {predicate}
                </DropDownLanguageElement>
                <DropDownButton onClick={() =>{
                    this.props.model.addPredicate(predicate);
                    this.props.engine.repaintCanvas();
                }}><FontAwesome name={"fas fa-plus"}/></DropDownButton>
            </DropDownRowContainer>
        )
    };

    setLockedParentIfNeeded(bool:boolean){
        if(this.props.model instanceof BinaryLabelModel){
            this.props.model.setLockedParent(bool);
        }
    }

    addGivenInputElement(){
        if (!this.props.badNameForLanguageElement && this.textInput.value) {
            this.props.model.addPredicate(this.textInput.value);
            this.textInput.value = "";
            this.props.setStateBadNameForLanguageElement(true);
            this.props.engine.repaintCanvas();
        }
    }

    render() {
        return (
            <DropDownModel pointerEvents={this.props.model.isEditable() ? "auto" : "none"}
                           cursor={this.props.model.isEditable() ? "pointer" : "move"}>
                <DropDownPorts>
                    <DropDownContainer>
                        {_.map(Array.from(getAvailablePredicatesForGivenArity(this.props.arity,this.props.model.getReduxProps(),this.props.model.getPredicates())), this.generateAvailablePredicate)}
                        <DropDownInputElement>
                            <DropDownRowContainer key={"lastPredicateOption"}>
                                <input onChange={(e) => {
                                    this.checkBadElementName(e.target.value, this.props.arity);
                                    this.props.setStateInputElementTextLength(e.target.value.length);
                                }}
                                       ref={(input) => this.textInput = input}
                                       onFocus={() => {
                                           this.props.model.setLocked(true);
                                           this.setLockedParentIfNeeded(true);
                                       }}
                                       onBlur={() => {
                                           this.props.model.setLocked(false);
                                           this.setLockedParentIfNeeded(false);
                                       }}
                                       onKeyDown={(e) => {
                                           if (e.key === "Enter") {
                                               this.addGivenInputElement();
                                           }
                                       }}
                                       placeholder={"New predicate/function"} style={{
                                    width: (this.props.widthOfInputElement) + "ch",
                                    height: 20 + "px",
                                    border: this.props.badNameForLanguageElement ? "1px solid red" : "1px solid black"
                                }}>
                                </input>
                                <DropDownButton onClick={() => {
                                    this.addGivenInputElement();
                                }}>{ADDPORT}</DropDownButton>
                            </DropDownRowContainer>
                        </DropDownInputElement>
                    </DropDownContainer>
                </DropDownPorts>
            </DropDownModel>
        )
    }
}
