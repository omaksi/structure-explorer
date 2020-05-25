import Language from "../math_view/model/Language";
import Structure from "../math_view/model/Structure";
import Conjunction from "../math_view/model/formula/Formula.Conjunction";
import Constant from "../math_view/model/term/Term.Constant";
import FunctionAtom from "../math_view/model/term/Term.FunctionTerm";
import PredicateSymbol from "../math_view/model/formula/Formula.PredicateAtom";
import Variable from "../math_view/model/term/Term.Variable";
import Negation from "../math_view/model/formula/Formula.Negation";
import Disjunction from "../math_view/model/formula/Formula.Disjunction";
import Implication from "../math_view/model/formula/Formula.Implication";
import UniversalQuant from "../math_view/model/formula/Formula.UniversalQuant";
import ExistentialQuant from "../math_view/model/formula/Formula.ExistentialQuant";
import EqualityAtom from "../math_view/model/formula/Formula.EqualityAtom";

let parser = require('../parser/grammar');

const setParserOptions = (s) => ({
  structure: s,
  conjunction: Conjunction,
  disjunction: Disjunction,
  implication: Implication,
  variable: Variable,
  constant: Constant,
  existentialQuant: ExistentialQuant,
  universalQuant: UniversalQuant,
  functionTerm: FunctionAtom,
  predicate: PredicateSymbol,
  negation: Negation,
  equalityAtom: EqualityAtom
});

test("∀x ∀y (p(x,y,x) -> x = y)", () => {
  let s = new Structure(new Language());
  s.setDomain(['1', '2', '3']);
  s.setLanguagePredicates([{name: 'p', arity: 3}]);
  s.setPredicateValue('p/3', ['1', '2', '3']);
  let e = new Map();
  let formula = '∀x ∀y (p(x,y,x) -> x = y)';
  let parsed = parser.parse(formula, setParserOptions(s));
  expect(parsed.eval(s, e)).toBe(true);
});
