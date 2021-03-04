import Formula from "./Formula";
import {NEGATION} from "../../constants/gameConstants";

/**
 * Represent negation
 * @author Milan Cifra
 * @class
 * @extends Formula
 */
class Negation extends Formula {

  /**
   *
   * @param {Formula} subFormula
   */
  constructor(subFormula) {
    super();
    this.subFormula = subFormula;
  }

  /**
   *
   * @param {Structure} structure
   * @param {Map} e
   * @return {boolean}
   */
  eval(structure, e) {
    return !this.subFormula.eval(structure, e);
  }

  /**
   *
   * @returns {string}
   */
  toString() {
    return `¬${this.subFormula.toString()}`;
  }

  createCopy(){
    let subFormula = this.subFormula.createCopy();
    return new Negation(subFormula);
  }

  getType(commitment){
    return NEGATION;
  }

  getSubFormulas(){
    return [this.subFormula];
  }

  setVariable(from, to){
    this.subFormula.setVariable(from, to);
  }
}

export default Negation;