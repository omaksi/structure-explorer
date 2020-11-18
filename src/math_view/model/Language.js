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

    /**
     *
     * These functions are temporarly here until the grammar changes
     *
     *
     */


  hasConstant(constantName) {
      return this.constants.has(constantName);
  }

  hasPredicate(predicateName) {
      return this.hasInSet(predicateName,this.predicates);
  }

  hasFunction(functionName) {
      return this.hasInSet(functionName,this.functions);
  }

  hasInSet(elementName,givenSet){
      let splited = elementName.split('/');
      if (splited.length !== 2) {
          return givenSet.has(splited[0]);
      }
      if (isNaN(parseInt(splited[1]))) {
          return false;
      }
      return givenSet.has(splited[0]) && givenSet.get(splited[0]).toString() === splited[1].toString();
  }

  /**
   * Return arity of the predicate
   * @param {string} predicateName
   * @return {int} arity of the predicate
   */
  getPredicate(predicateName) {
      return parseInt(this.predicates.get(predicateName));
  }

}

export default Language;