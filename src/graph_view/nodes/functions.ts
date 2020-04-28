import {FUNCTION, PREDICATE, UNBINARY} from "./ConstantNames";
import {RULE_CONSTANTS, RULE_DOMAIN} from "../../constants/parser_start_rules";
let parser = require('../../parser/grammar');

export function canUseNameForGivenArityAndType(predName:string,predArity:string,reduxProps:any,type:string):boolean{
    let structureObject = reduxProps["store"].getState().structureObject.language;

    if(structureObject.constants && structureObject.constants.has(predName)){
        return false;
    }

    let givenSet = type === PREDICATE?structureObject.functions:structureObject.predicates;
    if(givenSet && givenSet.has(predName)){
        return false;
    }

    let finalSet = type === PREDICATE?structureObject.predicates:structureObject.functions;

    if(finalSet){
        for(let [langaugeElementName,languageElementArity] of finalSet.entries()){
            if(langaugeElementName === predName){
                return languageElementArity === predArity;
            }
        }
    }
    return true;
}

function setNodeBadNameIfStateContainsNodeWithSameName(state:Map<string,any>,newName:string,setNodeBadName:any){
    if(state.has(newName)){
        setNodeBadName(true);
        return true;
    }
    else{
        setNodeBadName(false);
        return false;
    }
}

function parseText(name:string,setNodeBadName:any,startRule:any){
    try{
        parser.parse(name, {startRule: startRule});
        setNodeBadName(false);
        return false;
    }
    catch (e) {
        setNodeBadName(true);
        return true;
    }
}
export function setPredFuncBadNameIfRegexViolated(name:string,setBadName:any){
   return parseText(name,setBadName,RULE_CONSTANTS);
}

function setDomainBadNameIfRegexViolated(newName:string,setNodeBadName:any){
    parseText(newName,setNodeBadName,RULE_DOMAIN)
}

function setConstantsBadNameIfRegexViolated(newName:string,setNodeBadName:any){
    parseText(newName,setNodeBadName,RULE_CONSTANTS);
}

export function canUseNameForNode(oldName:string,newName:string,setNodeBadName:any,reduxProps:any,nodeType:string){
    let diagramState = reduxProps["store"].getState().diagramState;

    if(oldName === newName){
        setNodeBadName(false);
        return;
    }

    if(newName.length === 0 ){
        setNodeBadName(true);
        return;
    }

    if(setNodeBadNameIfStateContainsNodeWithSameName(nodeType === UNBINARY?diagramState.domainNodes:diagramState.constantNodes,newName,setNodeBadName)){
        return;
    }
    nodeType === UNBINARY?setDomainBadNameIfRegexViolated(newName,setNodeBadName):setConstantsBadNameIfRegexViolated(newName, setNodeBadName);
}

export function getAvailableLanguageElementForGivenArity(arity:string,reduxProps:any,modelSet:Set<string>,type:string):Set<string> {
    let languageElementSet: Set<string> = new Set();
    let languageElement = type === PREDICATE?reduxProps["store"].getState().structureObject.language.predicates:reduxProps["store"].getState().structureObject.language.functions;

    for(let [elementValue,elementArity] of languageElement.entries()){
        if(elementArity.toString() === arity && !modelSet.has(elementValue)){
            languageElementSet.add(elementValue);
        }
    }
    return languageElementSet;
}


export function getMaxLengthForGivenLanguageElementWithArity(arity:string,type:string,reduxProps:any):number{
    let maxLength = 0;
    let languageElement = type===PREDICATE?reduxProps["store"].getState().structureObject.language.predicates:reduxProps["store"].getState().structureObject.language.functions;

    for(let [elementValue,elementArity] of languageElement.entries()){
        if(elementArity === arity && maxLength<elementValue.length){
            maxLength = elementValue.length;
        }
    }
    return maxLength;
}

export function getWidestElement(isDropDownMenu:boolean,inputElementTestLength:number,model:any,width:number,predicateArity:string,functionArity:string) {
    if(isDropDownMenu){
        let predicateWidth = getMaxLengthForGivenLanguageElementWithArity(predicateArity,PREDICATE,model.getReduxProps());
        let functionWidth = 0;

        if(functionArity !== "0"){
            functionWidth = getMaxLengthForGivenLanguageElementWithArity(functionArity,FUNCTION,model.getReduxProps());
        }

        if(width<predicateWidth){
            width = predicateWidth;
        }
        if(width<functionWidth){
            width = functionWidth;
        }
        if(inputElementTestLength>width){
            width = inputElementTestLength;
        }
    }
    return width;
}
