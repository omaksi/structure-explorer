import Formula from "./Formula";
import {FIRST_QUESTION} from "../../constants/messages";

/**
 * Represent conjunction
 * @author Milan Cifra
 * @class
 * @extends Formula
 */
class Conjunction extends Formula {

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
   * @param {Map} e variables valuation
   * @return {boolean}
   */
  eval(structure, e= null) {
    return this.subLeft.eval(structure, e) && this.subRight.eval(structure, e);
  }

  /**
   *
   * @returns {string}
   */
  toString() {
    return `(${this.subLeft.toString()}) ∧ (${this.subRight.toString()})`;
  }

  generateMessage(gameCommitment, structure){
    let truthValue = gameCommitment ? "splnitelna" : "nesplnitelna";
    if(gameCommitment === null){
      return FIRST_QUESTION(this.toString());
    } else {
      let leftEval = this.subLeft.eval(structure);
      let form = leftEval !== gameCommitment ? this.subLeft.toString() : this.subRight.toString();
      return "Ak predpokladaš že formula " + this.toString() + " je " + truthValue + ", tak potom: " + form + " je " + truthValue;
    }
  }

  createCopy(){
    let subLeft = this.subLeft.createCopy();
    let subRight = this.subRight.createCopy();
    return new Conjunction(subLeft, subRight);
  }
}

export default Conjunction;