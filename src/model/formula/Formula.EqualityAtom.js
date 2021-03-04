import Formula from "./Formula";
import {ATOM} from "../../constants/gameConstants";

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
  eval(structure, e) {
    return this.subLeft.eval(structure, e) == this.subRight.eval(structure, e);
  }

  /**
   *
   * @returns {string}
   */
  toString() {
    return `(${this.subLeft.toString()} = ${this.subRight.toString()})`;
  }

  createCopy(){
    let subLeft = this.subLeft.createCopy();
    let subRight = this.subRight.createCopy();
    return new EqualityAtom(subLeft, subRight);
  }

  getType(commitment){
    return ATOM;
  }

  getSubFormulas(){
    return [];
  }

  setVariable(from, to){
    this.subLeft.setVariable(from, to);
    this.subRight.setVariable(from, to);
  }
}

export default EqualityAtom;