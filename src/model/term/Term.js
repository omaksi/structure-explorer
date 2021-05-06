import Expression from "../Expression";

/**
 * Represent simple term.
 * @author Milan Cifra
 * @class
 * @abstract
 *
 */
class Term extends Expression {

  /*constructor() {
    super();
  }*/

  toString() {
    return '';
  }

  createCopy(){
    return new Term();
  }

  substitute(from, to){
    //nothing
  }

  getVariables(){
    return [];
  }
}

export default Term;