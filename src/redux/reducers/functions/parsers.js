import {parseConstants, parsePredicates, parseFunctions, parseDomain, parseTuples, parseValuation, parseTerm, parseFormulaStrict} from '@fmfi-uk-1-ain-412/js-fol-parser';
import {CONSTANT, PREDICATE, FUNCTION, DOMAIN, VARIABLE, TERM} from "../../../constants";
import {getLanguageObject} from "../../selectors/languageObject";
import Variable from "../../../model/term/Term.Variable";
import Constant from "../../../model/term/Term.Constant";
import FunctionTerm from "../../../model/term/Term.FunctionTerm";
import PredicateAtom from "../../../model/formula/Formula.PredicateAtom";
import EqualityAtom from "../../../model/formula/Formula.EqualityAtom";
import Negation from "../../../model/formula/Formula.Negation";
import Conjunction from "../../../model/formula/Formula.Conjunction";
import Disjunction from "../../../model/formula/Formula.Disjunction";
import Implication from "../../../model/formula/Formula.Implication";
import ExistentialQuant from "../../../model/formula/Formula.ExistentialQuant";
import UniversalQuant from "../../../model/formula/Formula.UniversalQuant";
import Equivalence from "../../../model/formula/Formula.Equivalence";

export function parseLanguage(state, value, type){
    state.value = value;
    state.errorMessage = '';
    try {
        switch(type){
            case CONSTANT:
                state.parsed = parseConstants(value);
                break;
            case PREDICATE:
                state.parsed = parsePredicates(value);
                break;
            case FUNCTION:
                state.parsed = parseFunctions(value);
                break;
        }
    } catch (e) {
        state.errorMessage = e.message;
        return false;
    }
    return true;
}

export function parseStructure(state, value, wholeState, type){
    state.value = value;
    state.errorMessage = '';
    try {
        switch(type){
            case DOMAIN:
                state.parsed = parseDomain(value);
                break;
            case PREDICATE:
            case FUNCTION:
                state.parsed = parseTuples(value);
                break;
            case VARIABLE:
                state.parsed = parseValuation(value, getLanguageObject(wholeState).getLanguage());
                break;
        }
    } catch (e) {
        state.errorMessage = e.message;
    }
}

export function parseExpression(state, value, wholeState, type){
    let language = getLanguageObject(wholeState);
    state.value = value;
    state.errorMessage = '';
    try {
        if(type === TERM){
            const termFactories = getTermFactories(language);
            state.parsed = parseTerm(value, language.getLanguage(), termFactories);
        } else {
            const formulaFactories = getFormulaFactories(language);
            state.parsed = parseFormulaStrict(value, language.getLanguage(), formulaFactories);
        }
    } catch (e) {
        state.errorMessage = e.message;
        state.parsed = null;
    }
}

function getTermFactories(language){
    return({
        variable: (symbol, _) =>
            new Variable(symbol),
        constant: (symbol, _) =>
            new Constant(symbol),
        functionApplication: (funSymbol, args, ee) => {
            language.checkFunctionArity(funSymbol, args, ee);
            return new FunctionTerm(funSymbol, args);
        }
    });
}

function getFormulaFactories(language){
    return({...getTermFactories(language), ...{
        predicateAtom: (predSymbol, args, ee) => {
            language.checkPredicateArity(predSymbol, args, ee);
            return new PredicateAtom(predSymbol, args);
        },
        equalityAtom: (lhs, rhs, _) =>
            new EqualityAtom(lhs, rhs),
        negation: (formula, _) =>
            new Negation(formula),
        conjunction: (lhs, rhs, _) =>
            new Conjunction(lhs, rhs),
        disjunction: (lhs, rhs, _) =>
            new Disjunction(lhs, rhs),
        implication: (lhs, rhs, _) =>
            new Implication(lhs, rhs),
        equivalence: (lhs, rhs, _) =>
            new Equivalence(lhs, rhs),
        existentialQuant: (variable, formula, _) =>
            new ExistentialQuant(variable, formula),
        universalQuant: (variable, formula, _) =>
            new UniversalQuant(variable, formula)
    }});
}


