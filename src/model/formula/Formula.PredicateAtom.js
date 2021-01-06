import Formula from "./Formula";
import {FIRST_QUESTION} from "../../constants/messages";

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
  eval(structure, e = null) {
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

  generateMessage(gameCommitment, structure){
    let truthValue = gameCommitment ? 'splnitelna' : 'nesplnitelna';
    let oppositeTruthValue = gameCommitment ? 'nesplnitelna' : 'splnitelna';
    if(gameCommitment === null){
      return FIRST_QUESTION(this.toString());
    } else {
      let resolution = gameCommitment && this.eval(structure)
          ? 'Vyhral si, pretoze ' + this.toString() + ' je ' + truthValue
          : 'Prehral si, pretoze ' + this.toString() + ' je ' + oppositeTruthValue;
      return 'Ak predpokladaš, že ' + this.toString() + ' je ' + truthValue + '. ' + resolution;
    }
  }

  createCopy(){
    let terms = [];
    for(let term of this.terms){
        terms.push(term.createCopy());
    }
    let name = this.name;
    return new PredicateAtom(name, terms);
  }

}

export default PredicateAtom;