import Formula from "./Formula";
import {GAME_OPERATOR, PLAYER_OPERATOR} from "../../constants/gameConstants";

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
  eval(structure, e) {
    return this.subLeft.eval(structure, e) && this.subRight.eval(structure, e);
  }

  /**
   *
   * @returns {string}
   */
  toString() {
    return `(${this.subLeft.toString()} ∧ ${this.subRight.toString()})`;
  }

  createCopy(){
    let subLeft = this.subLeft.createCopy();
    let subRight = this.subRight.createCopy();
    return new Conjunction(subLeft, subRight);
  }

  getType(commitment){
    return commitment ? GAME_OPERATOR : PLAYER_OPERATOR;
  }

  getSubFormulas(){
    return [this.subLeft, this.subRight];
  }

  setVariable(from, to){
    this.subLeft.setVariable(from, to);
    this.subRight.setVariable(from, to);
  }
}

export default Conjunction;