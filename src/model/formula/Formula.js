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

  generateMessage(gameCommitment){
    return '';
  }

  createCopy(){
    return new Formula();
  }

}

export default Formula;