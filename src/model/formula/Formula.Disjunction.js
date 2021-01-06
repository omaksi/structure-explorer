import Formula from "./Formula";
import {FIRST_QUESTION} from "../../constants/messages";

/**
 * Represent disjunction
 * @author Milan Cifra
 * @class
 * @extends Formula
 */
class Disjunction extends Formula {

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
  eval(structure, e= null) {
    return this.subLeft.eval(structure, e) || this.subRight.eval(structure, e);
  }

  /**
   *
   * @returns {string}
   */
  toString() {
    return `(${this.subLeft.toString()}) ∨ (${this.subRight.toString()})`;
  }

  generateMessage(gameCommitment, structure){
    let truthValue = gameCommitment ? "splnitelna" : "nesplnitelna";
    if(gameCommitment === null){
      return FIRST_QUESTION(this.toString());
    } else {
      return "Ak predpokladaš že formula " + this.toString() + " je " + truthValue + ", tak potom: " + this.subLeft.toString()
          + " alebo " + this.subRight.toString() + " je " + truthValue;
    }
  }

  createCopy(){
    let subLeft = this.subLeft.createCopy();
    let subRight = this.subRight.createCopy();
    return new Disjunction(subLeft, subRight);
  }

}

export default Disjunction;