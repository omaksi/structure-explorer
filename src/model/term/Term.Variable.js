import Term from "./Term";

/**
 * Variable
 * @author Milan Cifra
 * @class
 * @extends Term
 */
class Variable extends Term {

  /**
   *
   * @param {string} name
   */
  constructor(name) {
    super();
    this.name = name;
  }

  /**
   * Return intepretation of variable.
   * @param {Structure} structure
   * @param {Map} e variables valuation
   * @return {string} domain item
   */
  eval(structure, e) {
    if (!e.has(this.name)) {
      throw `Hodnota premennej ${this.name} nie je definovaná`;
    }
    return e.get(this.name);
  }

  /**
   * Return string representation of variable
   * @returns {string}
   */
  toString() {
    return this.name;
  }

  createCopy(){
    let name = this.name;
    return new Variable(name);
  }

  setVariable(from, to){
    if(this.name === from){
      this.name = to;
    }
  }
}

export default Variable;