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

export function getAvailablePredicatesForGivenArity(arity:string,reduxProps:any,modelSet:Set<string>):Set<string> {
    let predicateSet: Set<string> = new Set();
    let predicates = reduxProps["store"].getState().structureObject.language.predicates;

    for(let [predValue,predArity] of predicates.entries()){
        if(predArity === arity && !modelSet.has(predValue)){
            predicateSet.add(predValue);
        }
    }

    return predicateSet;
}

export function getMaximumLengthOfPredicatesForGivenArity(arity:string,reduxProps:any):number{
    let maxLength = 0;
    let predicates = reduxProps["store"].getState().structureObject.language.predicates;

    for(let [predValue,predArity] of predicates.entries()){
        if(predArity === arity && maxLength<predValue.length){
            maxLength = predValue.length;
        }
    }
    return maxLength;
}

