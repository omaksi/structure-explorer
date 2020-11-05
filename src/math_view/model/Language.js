import {CONSTANT_IN_LANGUAGE, FUNCTION_IN_LANGUAGE, PREDICATE_IN_LANGUAGE} from "../constants/messages";
import {defaultInputData} from "../constants";

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
    parsedConstants.parsed.forEach(c => {
      if (!this.functions.has(c) && !this.predicates.has(c)) {
        this.addConstant(c);
      }
    });
    parsedFunctions.parsed.forEach(f => {
      if (!this.constants.has(f.name) && !this.predicates.has(f.name)) {
        this.addFunction(f.name, parseInt(f.arity));
      }
    });
    parsedPredicates.parsed.forEach(p => {
      if (!this.functions.has(p.name) && !this.constants.has(p.name)) {
        this.addPredicate(p.name, p.arity);
      }
    });
  }

  getConstants() {
    return this.constants;
  }

  hasItem(item) {
    return this.hasConstant(item) || this.hasFunction(item) || this.hasPredicate(item);
  }

  clearConstants() {
    this.constants.clear();
  }

  clearFunctions() {
    this.functions.clear();
  }

  clearPredicates() {
    this.predicates.clear();
  }

  setConstants(constants) {
    this.clearConstants();
    let message = '';
    constants.forEach(c => {
      if (this.functions.has(c)) {
        message = `${FUNCTION_IN_LANGUAGE} ${c}`;
        return;
      }
      if (this.predicates.has(c)) {
        message = `${PREDICATE_IN_LANGUAGE} ${c}`;
        return;
      }
      this.addConstant(c);
    });
    return message;
  }

  setPredicates(predicates) {
    this.clearPredicates();
    let message = '';
    predicates.forEach(p => {
      if (this.constants.has(p.name)) {
        message = `${CONSTANT_IN_LANGUAGE}  ${p.name}`;
        return;
      }
      if (this.functions.has(p.name)) {
        message = `${FUNCTION_IN_LANGUAGE} ${p.name}`;
        return;
      }
      this.addPredicate(p.name, p.arity);
    });
    return message;
  }

  setFunctions(functions) {
    this.clearFunctions();
    let message = '';
    functions.forEach(f => {
      if (this.constants.has(f.name)) {
        message = `${CONSTANT_IN_LANGUAGE} ${f.name}`;
        return;
      }
      if (this.predicates.has(f.name)) {
        message = `${PREDICATE_IN_LANGUAGE} ${f.name}`;
        return;
      }
      this.addFunction(f.name, parseInt(f.arity));
    });
    return message;
  }

  /**
   * Add constant name to the language
   * @param {string} constantName Constant name
   */
  addConstant(constantName) {
    this.constants.add(constantName);
  }

  /**
   * Add predicate name to the language
   * @param {string} predicateName Name of the predicate
   * @param {int} arity Arity of predicate
   */
  addPredicate(predicateName, arity) {
    this.predicates.set(predicateName, arity);
  }

  /**
   * Add function name to the language
   * @param {string} functionName Name of function
   * @param {int} arity Arity of function
   */
  addFunction(functionName, arity) {
    this.functions.set(functionName, arity);
  }

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
   * Return arity of the function
   * @param {string} functionName
   * @return {int} arity of the function
   */
  getFunction(functionName) {
    return this.functions.get(functionName);
  }

  /**
   * Return arity of the predicate
   * @param {string} predicateName
   * @return {int} arity of the predicate
   */
  getPredicate(predicateName) {
    return this.predicates.get(predicateName);
  }

}

export default Language;