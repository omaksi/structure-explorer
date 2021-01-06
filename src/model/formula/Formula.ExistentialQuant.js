import Formula from "./Formula";
import {FIRST_QUESTION} from "../../constants/messages";

/**
 * Represent existential quantificator
 * @author Milan Cifra
 * @class
 * @extends Formula
 */
class ExistentialQuant extends Formula {

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
  eval(structure, e= null) {
    let eCopy = new Map(e !== null ? e : structure.variables);
    for (let item of structure.domain) {
      eCopy.set(this.variableName, item);
      if (this.subFormula.eval(structure, eCopy)) {
        return true;
      }
    }
    return false;
  }

  /**
   *
   * @returns {string}
   */
  toString() {
    return `∃${this.variableName} (${this.subFormula.toString()})`;
  }

  generateMessage(gameCommitment, structure){
    let truthValue = gameCommitment ? 'splnitelna' : 'nesplnitelna';
    if(gameCommitment === null){
      return FIRST_QUESTION(this.toString());
    } else {
      return 'Pre ktorý prvok z domény predpokladaš, že formula ' + this.toString() + " je " + truthValue;
    }
  }

  createCopy(){
    let subFormula = this.subFormula.createCopy();
    let variableName = this.variableName;
    return new ExistentialQuant(variableName, subFormula);
  }

}

export default ExistentialQuant;