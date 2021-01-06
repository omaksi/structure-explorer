import Formula from "./Formula";
import {FIRST_QUESTION} from "../../constants/messages";

/**
 * Represent implication
 * @author Milan Cifra
 * @class
 * @extends Formula
 */
class Implication extends Formula {

  /**
   *
   * @param {Formula} subLeft
   * @param {Formula} subRight
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
  eval(structure, e = null) {
    return (!this.subLeft.eval(structure)) || this.subRight.eval(structure);
  }

  /**
   *
   * @returns {string}
   */
  toString() {
    return `(${this.subLeft.toString()}) → (${this.subRight.toString()})`;
  }

  generateMessage(gameCommitment){
    if(gameCommitment === null){
      return FIRST_QUESTION(this.toString());
    } else {
      return 'Veríš, že ' + this.toString() + " je " + gameCommitment;
    }
  }

  createCopy(){
    let subLeft = this.subLeft.createCopy();
    let subRight = this.subRight.createCopy();
    return new Implication(subLeft, subRight);
  }

}

export default Implication;