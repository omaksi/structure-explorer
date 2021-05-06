/**
 * Represent expression in logic
 * @author Milan Cifra
 * @class
 * @abstract
 */
class Expression {

  /*constructor() {

  }*/

  toString() {

  }

  eval(structure, e) {
    return null;
  }

  substitute(from, to){
    //nothing
  }

  getVariables(){
    return [];
  }
}

export default Expression;