import {parseConstants, parsePredicates, parseFunctions, parseDomain, parseTuples, parseValuation} from '@fmfi-uk-1-ain-412/js-fol-parser';
import {CONSTANT, PREDICATE, FUNCTION, DOMAIN, VARIABLE} from "../../../constants";
import {getLanguageObject} from "../../selectors/languageObject";

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

export function parseStructure(state, value, wholeState, type){
    state.value = value;
    state.errorMessage = '';
    if (value.length === 0) {
        state.parsed = [];
        return;
    }
    try {
        let parsedValue;
        switch(type){
            case DOMAIN:
                parsedValue = parseDomain(value);
                break;
            case PREDICATE:
            case FUNCTION:
                parsedValue = parseTuples(value);
                break;
            case VARIABLE:
                parsedValue = parseValuation(value, getLanguageObject(wholeState));
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
        state.parsed = [];
    }
}

