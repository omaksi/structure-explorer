import Formula from "./Formula";
import {FIRST_QUESTION} from "../../constants/messages";

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
  eval(structure, e= null) {
    return !this.subFormula.eval(structure, e);
  }

  /**
   *
   * @returns {string}
   */
  toString() {
    return `¬(${this.subFormula.toString()})`;
  }

  generateMessage(gameCommitment){
    let truthValue = gameCommitment ? 'splnitelna' : 'nesplnitelna';
    let oppositeTruthValue = gameCommitment ? 'nesplnitelna' : 'splnitelna';
    if(gameCommitment === null){
      return FIRST_QUESTION(this.toString());
    } else {
      return 'Ak predpokladaš, že ' + this.toString() + ' je ' + truthValue + ", tak potom "
          + this.subFormula.toString() + ' je ' + oppositeTruthValue;
    }
  }

  createCopy(){
    let subFormula = this.subFormula.createCopy();
    return new Negation(subFormula);
  }

}

export default Negation;