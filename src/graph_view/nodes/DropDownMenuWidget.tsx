import styled from "@emotion/styled";
import _ from 'lodash';
import * as React from 'react';
import FontAwesome from "react-fontawesome";
import { DiagramEngine } from "@projectstorm/react-diagrams";
import {ADDFUNC, ADDPRED, FUNCTION, PREDICATE} from "./ConstantNames";
import {canUseNameForGivenArityAndType, getAvailableLanguageElementForGivenArity} from "./functions";
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
		padding: 3px 3px;
		font-size:11px;
		text-align:center;
		cursor: context-menu;
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
    setStateInputElementTextLength:any;
    widthOfInputElement:number;
    modelName?:string;
    arity:string;
    closeDropDown:any;
}

interface DropDownMenuWidgetState {
    badNameForLanguageElement:boolean;
}

export class DropDownMenuWidget extends React.Component<DropDownMenuWidgetProps,DropDownMenuWidgetState> {
    textInput:HTMLInputElement;

    constructor(props:DropDownMenuWidgetProps) {
        super(props);
        this.generatePredicateComponent = this.generatePredicateComponent.bind(this);
        this.generateFunctionComponent = this.generateFunctionComponent.bind(this);
        this.setStateBadNameForLanguageElement = this.setStateBadNameForLanguageElement.bind(this);

        this.state = {
            badNameForLanguageElement:true
        }
    }

    checkBadElementName(elementName:string){
        elementName = elementName.replace(/\s/g, "");

        if(elementName === "" || elementName.includes(",") || elementName.includes("/") || elementName.includes("<") || elementName.includes(">")){
            this.setStateBadNameForLanguageElement(true);
            return;
        }
        else{
            this.setStateBadNameForLanguageElement(false);
        }
    }

    generatePredicateComponent(elementObject:string){
        return this.generateAvailableLanguageElement(elementObject,PREDICATE);
    }


    setStateBadNameForLanguageElement(bool:boolean){
        this.setState({badNameForLanguageElement: bool});
    }

    generateFunctionComponent(elementObject:string){
        return this.generateAvailableLanguageElement(elementObject,FUNCTION);
    }

    generateAvailableLanguageElement = (languageElement: string,type:string) => {
        return (
            <DropDownRowContainer key={languageElement} >
                <DropDownLanguageElement>
                    {languageElement}
                </DropDownLanguageElement>
                <DropDownButton title={"Pridaj "+(type===PREDICATE?"predikát":"funkciu")} onClick={() =>{
                    type === PREDICATE?this.props.model.addPredicate(languageElement):this.props.model.addFunction(languageElement);
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

    componentDidMount(): void {
        //will re-render link so the position will be correct
        if(this.props.model instanceof BinaryLabelModel){
            // @ts-ignore
            this.props.model.getParent().increaseChangeCounter();
            this.props.engine.repaintCanvas();
        }
    }

    componentWillUnmount(): void {
        this.props.model.getReduxProps()["focusOnBodyElement"]();
    }

    addGivenInputElement(type:string) {
        if(this.textInput.value){
            this.checkBadElementName(this.textInput.value);
        }
        else{
            this.setStateBadNameForLanguageElement(true);
        }

        if (!this.state.badNameForLanguageElement) {
            if(canUseNameForGivenArityAndType(this.textInput.value, type === PREDICATE ? this.props.arity : ((parseInt(this.props.arity) - 1).toString()), this.props.model.getReduxProps(), type)) {
                if (!this.state.badNameForLanguageElement) {
                    if (type === PREDICATE) {
                        this.props.model.addPredicate(this.textInput.value);
                    } else {
                        this.props.model.addFunction(this.textInput.value);
                    }
                    this.textInput.value = "";
                    this.setStateBadNameForLanguageElement(true);
                    this.props.engine.repaintCanvas();
                }
            }
            else{
                this.setStateBadNameForLanguageElement(true);
            }
        }
    }

    render() {
        let funcArity:number = parseInt(this.props.arity)-1;

        return (
            <DropDownModel pointerEvents={this.props.model.isEditable() ? "auto" : "none"}
                           cursor={this.props.model.isEditable() ? "pointer" : "move"}
            >
                <DropDownPorts>
                    <DropDownContainer>
                        <DropDownTitleName title={"Zoznam použiteľných predikátov pre aritu "+this.props.arity}>
                            Pred
                        </DropDownTitleName>
                        {_.map(Array.from(getAvailableLanguageElementForGivenArity(this.props.arity,this.props.model.getReduxProps(),this.props.model.getPredicates(),PREDICATE)), this.generatePredicateComponent)}
                        {funcArity !== 0?
                            <DropDownTitleName title={"Zoznam použiteľných funkcií pre aritu "+funcArity}>
                                Func
                            </DropDownTitleName>:null
                        }
                        {funcArity !== 0?_.map(Array.from(getAvailableLanguageElementForGivenArity((parseInt(this.props.arity)-1).toString(),this.props.model.getReduxProps(),this.props.model.getFunctions(),FUNCTION)), this.generateFunctionComponent):null}
                        <DropDownInputElement>
                            <DropDownRowContainer key={"lastPredicateOption"}>
                                <input onChange={(e) => {
                                    this.checkBadElementName(e.target.value);
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
                                           if (e.key === "Escape") {
                                               this.props.closeDropDown();
                                           }
                                           else if (e.key === "Enter" && funcArity === 0) {
                                               this.addGivenInputElement(PREDICATE);
                                           }
                                       }}
                                       placeholder={funcArity!==0?"Add pred/func":"Add predicate"} style={{
                                    width: (this.props.widthOfInputElement===1?2:this.props.widthOfInputElement) + "ch",
                                    height: 20 + "px",
                                    border: this.state.badNameForLanguageElement ? "1px solid red" : "1px solid black"
                                }}>
                                </input>
                                <DropDownButton title={"Pridaj nový predikát"} onClick={() => {
                                    this.addGivenInputElement(PREDICATE);
                                }}>{ADDPRED}</DropDownButton>
                                {
                                    funcArity!==0?
                                        <DropDownButton title={"Pridaj novú funkciu"} onClick={() => {
                                            this.addGivenInputElement(FUNCTION);
                                        }}>{ADDFUNC}</DropDownButton>
                                        :null
                                }
                            </DropDownRowContainer>
                        </DropDownInputElement>
                    </DropDownContainer>
                </DropDownPorts>
            </DropDownModel>
        )
    }
}
