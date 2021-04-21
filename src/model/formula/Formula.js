import Expression from "../Expression";

/**
 * Represent simple formula
 * @author Milan Cifra
 * @class
 * @abstract
 * @extends Expression
 */
class Formula extends Expression {

  /*constructor() {
    super();
  }*/

  toString() {
    return '';
  }

  createCopy() {
    return new Formula();
  }

  getType(commitment) {
    return '';
  }

  getSubFormulas(structureObject, variableObject) {
    return [];
  }

  setVariable(from, to){
    //nothing
  }
}



export default Formula;