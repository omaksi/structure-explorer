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

  getSubFormulas() {
    return [];
  }

  setVariable(from, to){
    //nothing
  }

  getSubFormulasCommitment(commitment){
    return [];
  };

  getVariables(){
    return [];
  }
}



export default Formula;