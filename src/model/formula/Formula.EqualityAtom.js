import Formula from "./Formula";
import {FIRST_QUESTION} from "../../constants/messages";

/**
 * Represent equality symbol
 * @author Milan Cifra
 * @class
 * @extends Formula
 */
class EqualityAtom extends Formula {

  /**
   *
   * @param {Term} subLeft
   * @param {Term} subRight
   */
  constructor(subLeft, subRight) {
    super();
    this.subLeft = subLeft;
    this.subRight = subRight;
  }

  /**
   *
   * @param {Structure} structure
   * @param {Map} e
   * @return {boolean}
   */
  eval(structure, e= null) {
    return this.subLeft.eval(structure, e) == this.subRight.eval(structure, e);
  }

  /**
   *
   * @returns {string}
   */
  toString() {
    return `(${this.subLeft.toString()}) = (${this.subRight.toString()})`;
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
      return 'Ak predpokladaš, že ' + this.toString() + ' je ' + truthValue + '.\n' + resolution;
    }
  }

  createCopy(){
    let subLeft = this.subLeft.createCopy();
    let subRight = this.subRight.createCopy();
    return new EqualityAtom(subLeft, subRight);
  }

}

export default EqualityAtom;