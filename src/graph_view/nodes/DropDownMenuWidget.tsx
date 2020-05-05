import styled from "@emotion/styled";
import _ from 'lodash';
import * as React from 'react';
import FontAwesome from "react-fontawesome";
import { DiagramEngine } from "@projectstorm/react-diagrams";
import {ADDFUNC, ADDPRED, FUNCTION, PREDICATE} from "./ConstantNames";
import {
    canUseNameForGivenArityAndType, functionIsAlreadyDefinedForGivenFunction,
    getAvailableLanguageElementForGivenArity,
    setPredFuncBadNameIfRegexViolated
} from "./functions";
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

export const DropDownButton = styled.div<{color: string}>`
		outline: none;
		cursor: pointer;
		height: 20px;
		background: rgba(white, 0.1);
		color: black;
		text-align:center;
		padding-left:0.2em;
		padding-right:0.2em;
		
		&:hover {
			background: ${p => p.color};
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
    canAddAsPredicate:boolean;
    canAddAsFunction:boolean;
    inputTitle:string,
    predicateButtonTitle:string,
    functionButtonTitle:string,
}

export class DropDownMenuWidget extends React.Component<DropDownMenuWidgetProps,DropDownMenuWidgetState> {
    textInput:HTMLInputElement;

    constructor(props:DropDownMenuWidgetProps) {
        super(props);
        this.generatePredicateComponent = this.generatePredicateComponent.bind(this);
        this.generateFunctionComponent = this.generateFunctionComponent.bind(this);
        this.setStateBadNameForLanguageElement = this.setStateBadNameForLanguageElement.bind(this);
        this.clearTextInput = this.clearTextInput.bind(this);

        this.state = {
            badNameForLanguageElement:true,
            canAddAsFunction:true,
            canAddAsPredicate:true,
            inputTitle:"Zadaj názov pre predikát alebo funkciu",
            predicateButtonTitle:"Pridaj nový predikát",
            functionButtonTitle:"Pridaj novú funkciu",
        }
    }

    setStateBadNameForPredFunc(elementName:string){
        if(setPredFuncBadNameIfRegexViolated(elementName,this.setStateBadNameForLanguageElement)){
            this.setState({inputTitle:"Zadaný názov nie je v správnom tvare"});
            return true;
        }
        this.setState({inputTitle:"Zadaj názov pre predikát alebo funkciu"});
        return false;
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
        let alreadyDefined:boolean;
        if(type === FUNCTION && this.props.arity!=="1" && this.props.arity!=="2"){
            alreadyDefined = functionIsAlreadyDefinedForGivenFunction(this.props.model.getNodeParameters(),this.props.model.getNodeValue(),languageElement+"/"+(parseInt(this.props.arity)-1).toString(),this.props.model.getReduxProps());
        }

        return (
            <DropDownRowContainer key={languageElement} >
                <DropDownLanguageElement>
                    {languageElement}
                </DropDownLanguageElement>
                <DropDownButton color={(type===FUNCTION && alreadyDefined)?"red":"#00ff80"} title={(type===FUNCTION && alreadyDefined)?"Funkcia nemôže byť viackrát definovaná pre rovnaký(é) parameter(tre)":("Pridaj "+(type===PREDICATE?"predikát":"funkciu"))} onClick={() =>{
                    if(type === PREDICATE){
                        this.props.model.addPredicate(languageElement)
                    }
                    else{
                        if(!alreadyDefined){
                            this.props.model.addFunction(languageElement)
                        }
                    }
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

    setCanUseForGivenType(type:string,elementName:string){
        if(canUseNameForGivenArityAndType(elementName, type === PREDICATE ? this.props.arity : ((parseInt(this.props.arity) - 1).toString()), this.props.model.getReduxProps(), type)){
            if(type === PREDICATE){
                this.setState({canAddAsPredicate:true,predicateButtonTitle:"Pridaj nový predikát"});
            }
            else{
                this.setState({canAddAsFunction:true,functionButtonTitle:"Pridaj novú funkciu"});
                if(this.props.arity!=="2"){
                    if(functionIsAlreadyDefinedForGivenFunction(this.props.model.getNodeParameters(),this.props.model.getNodeValue(),this.textInput.value+"/"+(parseInt(this.props.arity)-1).toString(),this.props.model.getReduxProps())){
                        this.setState({canAddAsFunction:false,functionButtonTitle:"Funkcia nemôže byť viackrát definovaná pre rovnaký(é) parameter(tre)"});
                    }
                }
            }
        }
        else{
            if(type === PREDICATE){
                this.setState({canAddAsPredicate:false,predicateButtonTitle:"Predikát nejde pridať, predikát alebo funkcia s daným menom už existuje pre iný typ alebo pre inú aritu"});
            }
            else{
                this.setState({canAddAsFunction:false,functionButtonTitle:"Funkciu nejde pridať, predikát alebo funkcia s daným menom už existuje pre iný typ alebo pre inú aritu"});
            }
            return;
        }
    }

    clearTextInput(){
        this.textInput.value = "";
        this.setState({badNameForLanguageElement:true,canAddAsFunction:true,canAddAsPredicate:true});
        this.props.engine.repaintCanvas();
    }

    addGivenInputElement(type:string) {
        if(!this.setStateBadNameForPredFunc(this.textInput.value.replace(/\s/g, "")) && canUseNameForGivenArityAndType(this.textInput.value, type === PREDICATE ? this.props.arity : ((parseInt(this.props.arity) - 1).toString()), this.props.model.getReduxProps(), type)){
            if (type === PREDICATE) {
                this.props.model.addPredicate(this.textInput.value);
            } else {
                if(!this.state.canAddAsFunction){
                    return;
                }
                this.props.model.addFunction(this.textInput.value);
            }
            this.clearTextInput();
        }
    }

    render() {
        let funcArity:number = parseInt(this.props.arity)-1;

        return (
            <DropDownModel pointerEvents={this.props.model.isEditable() ? "auto" : "none"}
                           cursor={this.props.model.isEditable() ? "pointer" : "move"}>
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
                                <input title={this.state.inputTitle} onChange={(e) => {
                                    let elName:string = e.target.value.replace(/\s/g, "");
                                    this.props.setStateInputElementTextLength(e.target.value.length);
                                    if(!this.setStateBadNameForPredFunc(elName)){
                                        this.setCanUseForGivenType(PREDICATE,elName);
                                        if(this.props.arity!=="1"){
                                            this.setCanUseForGivenType(FUNCTION,elName);
                                        }
                                    }
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
                                <DropDownButton color={this.state.canAddAsPredicate?"#00ff80":"red"} title={this.state.predicateButtonTitle} onClick={() => {
                                    this.addGivenInputElement(PREDICATE);
                                }}>{ADDPRED}</DropDownButton>
                                {
                                    funcArity!==0?
                                        <DropDownButton color={this.state.canAddAsFunction?"#00ff80":"red"} title={this.state.functionButtonTitle} onClick={() => {
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
