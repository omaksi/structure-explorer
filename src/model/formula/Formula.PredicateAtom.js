import Formula from "./Formula";
import {FIRST_QUESTION} from "../../constants/messages";
import {ATOM} from "../../constants/gameConstants";

/**
 * Represent predicate symbol
 * @author Milan Cifra
 * @class
 * @extends Formula
 */
class PredicateAtom extends Formula {

  /**
   *
   * @param {string} name
   * @param {Term[]} terms
   */
  constructor(name, terms = []) {
    super();
    this.name = name;
    this.terms = terms;
  }

  /**
   *
   * @param {Structure} structure
   * @param {Map} e
   * @return {boolean}
   */
  eval(structure, e) {
    let translatedTerms = [];
    this.terms.forEach(term => {
      translatedTerms.push(term.eval(structure, e));
    });
    let arity = structure.language.predicates.get(this.name);
    if (structure.iPredicate.get(this.name + '/' + arity) === undefined) {
      return false;
    }
    let value = structure.iPredicate.get(this.name + '/' + arity);
    return value.findIndex(e => JSON.stringify(e) === JSON.stringify(translatedTerms)) > -1;
  }

  /**
   *
   * @returns {string}
   */
  toString() {
    let res = this.name + '(';
    for (let i = 0; i < this.terms.length; i++) {
      if (i > 0) {
        res += ', ';
      }
      res += this.terms[i].toString();
    }
    res += ')';
    return res;
  }

  createCopy(){
    let terms = [];
    for(let term of this.terms){
        terms.push(term.createCopy());
    }
    let name = this.name;
    return new PredicateAtom(name, terms);
  }

  getType(commitment){
    return ATOM;
  }

  getSubFormulas(){
    return [];
  }

  setVariable(from, to){
    this.terms.forEach(term => term.setVariable(from, to));
  }
}

export default PredicateAtom;