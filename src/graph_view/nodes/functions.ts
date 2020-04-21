import {FUNCTION, PREDICATE} from "./ConstantNames";

export function canUsePredicateForGivenArity(predName:string,predArity:string,reduxProps:any):boolean{
    let predicates = reduxProps["store"].getState().language.predicates.parsed;

    if(predicates){
        for(let predicateObject of predicates){
            if(predicateObject.name === predName){
                return predicateObject.arity === predArity;
            }
        }
    }
    return true;
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
