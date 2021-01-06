import Formula from "./Formula";
import {FIRST_QUESTION} from "../../constants/messages";

/**
 * Represent universal quantificator
 * @author Milan Cifra
 * @class
 * @extends Formula
 */
class UniversalQuant extends Formula {

  /**
   *
   * @param {string} variableName
   * @param {Formula} subFormula
   */
  constructor(variableName, subFormula) {
    super();
    this.variableName = variableName;
    this.subFormula = subFormula;
  }

  /**
   *
   * @param {Structure} structure
   * @param {Map} e
   * @return {boolean}
   */
  eval(structure, e = null) {
    let eCopy = new Map(e !== null ? e : structure.variables);
    for (let item of structure.domain) {
      eCopy.set(this.variableName, item);
      if (!this.subFormula.eval(structure, eCopy)) {
        return false;
      }
    }
    return true;
  }

  /**
   *
   * @returns {string}
   */
  toString() {
    return `∀${this.variableName} (${this.subFormula.toString()})`;
  }

  generateMessage(gameCommitment, structure){
    let truthValue = gameCommitment ? 'splnitelna' : 'nesplnitelna';
    if(gameCommitment === null){
      return FIRST_QUESTION(this.toString());
    } else {
      let eCopy = new Map(structure.variables);
      for (let item of structure.domain) {
        eCopy.set(this.variableName, item);
        if (!this.subFormula.eval(structure, eCopy)) {
          return 'Ak predpokladaš, že ' + this.toString() + ' je ' + truthValue + ', tak potom aj ';
        }
      }
    }
  }

  createCopy(){
    let subFormula = this.subFormula.createCopy();
    let variableName = this.variableName;
    return new UniversalQuant(variableName, subFormula);
  }

}

export default UniversalQuant;