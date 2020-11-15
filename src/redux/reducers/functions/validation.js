import {
    CONSTANT_IN_LANGUAGE,
    EMPTY_CONSTANT_VALUE, FUNCTION_ALREADY_DEFINED,
    FUNCTION_IN_LANGUAGE, FUNCTION_NOT_FULL_DEFINED,
    PREDICATE_IN_LANGUAGE
} from "../../../math_view/constants/messages";


export function validateLanguageConstants(constants, functions, predicates){
    let message = '';
    constants.forEach(c => {
        if (functions.some(value => value.name === c)) {
            message = `${FUNCTION_IN_LANGUAGE} ${c}`;
            return;
        }
        if (predicates.some(value => value.name === c)) {
            message = `${PREDICATE_IN_LANGUAGE} ${c}`;
            return;
        }
        if (constants.filter(value => value === c).length > 1) {
            message = `${CONSTANT_IN_LANGUAGE}  ${c}`;
            return;
        }
    });
    return message;
}

export function validateLanguagePredicates(constants, functions, predicates){
    let message = '';
    predicates.forEach(p => {
        if (constants.some(value => value === p.name)) {
            message = `${CONSTANT_IN_LANGUAGE}  ${p.name}`;
            return;
        }
        if (functions.some(value => value.name === p.name)) {
            message = `${FUNCTION_IN_LANGUAGE} ${p.name}`;
            return;
        }
        if(predicates.filter(value => value.name === p.name).length > 1){
            message = `${PREDICATE_IN_LANGUAGE} ${p.name}`;
            return;
        }
    });
    return message;
}

export function validateLanguageFunctions(constants, functions, predicates){
    let message = '';
    functions.forEach(f => {
        if (constants.some(value => value === f.name)) {
            message = `${CONSTANT_IN_LANGUAGE} ${f.name}`;
            return;
        }
        if (predicates.some(value => value.name === f.name)) {
            message = `${PREDICATE_IN_LANGUAGE} ${f.name}`;
            return;
        }
        if(functions.filter(value => value.name === f.name).length > 1){
            message = `${FUNCTION_IN_LANGUAGE} ${f.name}`;
            return;
        }
    });
    return message;
}

export function validateStructureConstants(constantName, value, constants, domainValues){
    if (!constants.includes(constantName)) {
        throw `Jazyk neobsahuje konštantu ${constantName}`;
    }
    if (!domainValues.includes(value)) {
        throw EMPTY_CONSTANT_VALUE;
    }
}

export function validateStructurePredicates(predicateValues, domainValues, arity){
    let message = '';
    predicateValues.forEach(tuple => {
        if(tuple.length !== arity){
            message = `N-tica ${tuple} nemá povolený počet prvkov`;
            return;
        }
        if (predicateValues.filter(t => t.equals(tuple)).length > 1) {
            message = `N-tica ${tuple} sa v predikáte už nachádza`;
            return;
        }
        let illegalItems = tuple.filter(t => !domainValues.includes(t));
        if(illegalItems.length > 0){
            message = `Prvok ${illegalItems[0]} nie je v doméne štruktúry`;
            return;
        }
    });
    return message;
}

export function validateStructureFunctions(functionValues, domainValues, arity){
    let message = '';
    let usedParams = [];
    functionValues.forEach(tuple => {
        let params = tuple.slice(0, tuple.length - 1); //takes just the arguments of the function
        let stringParams = params.join(",");
        if(!usedParams.includes(stringParams)){
            message = FUNCTION_ALREADY_DEFINED(params);
            return;
        }
        if(params.length !== arity){
            message = `Počet parametrov ${params} nezodpovedá arite funkcie`;
            return;
        }
        let illegalItems = tuple.filter(t => !domainValues.includes(t));
        if (illegalItems.length > 0) {
            message = `Prvok ${illegalItems[0]} nie je v doméne štruktúry`;
            return;
        }
        usedParams.push(stringParams);
    });

    if(functionValues.length !== Math.pow(arity, domainValues.length)){
        message = FUNCTION_NOT_FULL_DEFINED;
    }
    return message;
}
