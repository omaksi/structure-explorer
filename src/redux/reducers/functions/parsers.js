import {parseConstants, parsePredicates, parseFunctions} from '@fmfi-uk-1-ain-412/js-fol-parser';
import {CONSTANT, PREDICATE, FUNCTION} from "../../../constants";

export function parseLanguage(state, value, type){
    let previousParsed = state.parsed;
    state.value = value;
    state.errorMessage = '';
    if (value.length === 0) {
        state.parsed = [];
        return;
    }
    try {
        let parsedValue;
        switch(type){
            case CONSTANT:
                parsedValue = parseConstants(value);
                break;
            case PREDICATE:
                parsedValue = parsePredicates(value);
                break;
            case FUNCTION:
                parsedValue = parseFunctions(value);
                break;
        }

        if (parsedValue.items) {
            state.parsed = parsedValue.items;
        } else {
            state.parsed = parsedValue;
        }
    } catch (e) {
        console.error(e);
        state.errorMessage = e.message;
        state.parsed = previousParsed;
    }
}

