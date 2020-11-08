import {CONSTANT_IN_LANGUAGE, FUNCTION_IN_LANGUAGE, PREDICATE_IN_LANGUAGE} from "../../../math_view/constants/messages";


export function validateConstants(constants, functions, predicates){
    let message = '';
    constants.forEach(c => {
        if (functions.has(c)) {
            message = `${FUNCTION_IN_LANGUAGE} ${c}`;
            return;
        }
        if (predicates.has(c)) {
            message = `${PREDICATE_IN_LANGUAGE} ${c}`;
            return;
        }
    });
    return message;
}

export function validatePredicates(constants, functions, predicates){
    let message = '';
    predicates.forEach(p => {
        if (constants.has(p.name)) {
            message = `${CONSTANT_IN_LANGUAGE}  ${p.name}`;
            return;
        }
        if (functions.has(p.name)) {
            message = `${FUNCTION_IN_LANGUAGE} ${p.name}`;
            return;
        }
    });
    return message;
}

export function validateFunctions(constants, functions, predicates){
    let message = '';
    functions.forEach(f => {
        if (constants.has(f.name)) {
            message = `${CONSTANT_IN_LANGUAGE} ${f.name}`;
            return;
        }
        if (predicates.has(f.name)) {
            message = `${PREDICATE_IN_LANGUAGE} ${f.name}`;
            return;
        }
    });
    return message;
}