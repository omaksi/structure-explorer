import {CONSTANT_IN_LANGUAGE, FUNCTION_IN_LANGUAGE, PREDICATE_IN_LANGUAGE} from "../constants/messages";

/**
 * Represent language of logic
 * @author Milan Cifra
 * @class
 */
class Language {

  constructor(parsedConstants = [],
              parsedFunctions = [{}],
              parsedPredicates = [{}]) {
    this.constants = new Set();
    this.functions = new Map();
    this.predicates = new Map();
    parsedConstants.forEach(c => {
        this.constants.add(c);
    });
    parsedFunctions.forEach(f => {
        this.functions.set(f.name, f.arity);
    });
    parsedPredicates.forEach(p => {
        this.predicates.set(p.name, p.arity);
    });
  }
}

export default Language;