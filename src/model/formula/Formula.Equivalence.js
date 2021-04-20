import Formula from "./Formula";
import {ATOM, GAME_EQUIVALENCE, PLAYER_EQUIVALENCE} from "../../constants/gameConstants";

/**
 * Represent equality symbol
 * @author Richard Toth
 * @class
 * @extends Formula
 */
class Equivalence extends Formula {

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
    eval(structure, e) {
        const left = this.subLeft.eval(structure, e);
        const right = this.subRight.eval(structure, e);
        return left == right;
    }

    /**
     *
     * @returns {string}
     */
    toString() {
        return `(${this.subLeft.toString()} ↔ ${this.subRight.toString()})`;
    }

    createCopy(){
        let subLeft = this.subLeft.createCopy();
        let subRight = this.subRight.createCopy();
        return new Equivalence(subLeft, subRight);
    }

    getType(commitment){
        return commitment ? GAME_EQUIVALENCE : PLAYER_EQUIVALENCE;
    }

    getSubFormulas(){
        return [this.subLeft, this.subRight];
    }

    setVariable(from, to){
        this.subLeft.setVariable(from, to);
        this.subRight.setVariable(from, to);
    }
}

export default Equivalence;