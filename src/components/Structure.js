import React from 'react';
import {
  Panel,
  Row
} from "react-bootstrap";
import Domain from "./elements/Domain";
import ConstantInterpretation from "./elements/ConstantInterpretation";
import PredicateInterpretation from "./elements/PredicateInterpretation";
import FunctionInterpretation from "./elements/FunctionInterpretation";
import DatabaseTable from "./elements/DatabaseTable";

const help = (
   <div className="collapse" id="help-structure">
     <div className="well">
       Pomocou editoru štruktúry sa definuje štruktúra. Prvky <strong>domény</strong> sa oddeľujú čiarkami.
       Pridaním nového symbolu do jazyka sa automaticky pridá vstup na zadanie interpretácie.
       Interpretácia <strong>konštanty</strong> sa vyberá zo selectu, ktorý automaticky obsahuje prvky z
       domény. Interpretácia <strong>predikátového symbolu</strong> s&nbsp;aritou&nbsp;<var>n</var> sa zapisuje vo
       formáte <code>(prvok<sub>1</sub>, …, prvok<sub><var>n</var></sub>)</code>.
       Interpretácia <strong>funkčného symbolu</strong> s&nbsp;aritou&nbsp;<var>n</var> sa zapisuje vo
       formáte <code>(prvok<sub>1</sub>, …, prvok<sub><var>n</var></sub>, hodnota)</code>.
     </div>
   </div>
);

function Structure({structure,setDomain,lockDomain,teacherMode,setConstantValue,structureObject,lockConstantValue,setPredicateValueText,lockPredicateValue,toggleTable,domain,setPredicateValueTable,setFunctionValueText,lockFunctionValue,setFunctionValueTable}) {

    //nechat alebo dat do kazdej skupiny? takto to je mozno menej performance heavy
    let constants = Object.keys(structure.constants);
    let predicates = Object.keys(structure.predicates);
    let functions = Object.keys(structure.functions);


  return (
     <Panel>
       <Panel.Heading>
         <Panel.Title componentClass='h2'>Štruktúra 𝓜 = (<var>M</var>, <var>i</var>)</Panel.Title>
         <span  data-toggle="collapse" data-target="#help-structure" aria-expanded="false" aria-controls="collapseExample">?</span>
       </Panel.Heading>

       <Panel.Body>
         {help}
           <Row>
               <Domain structure={structure} setDomain={setDomain} lockDomain={lockDomain} teacherMode={teacherMode} lengthOfCol={12}/>
           </Row>
         {constants.length === 0 ? null : (
            <Row>
                <ConstantInterpretation structure={structure} teacherMode={teacherMode} constants={constants} lockConstantValue={lockConstantValue} setConstantValue={setConstantValue} structureObject={structureObject} lengthOfCol={12}/>
            </Row>
         )}
         {predicates.length === 0 ? null : (
            <Row>
                <PredicateInterpretation structureObject={structureObject} structure={structure} teacherMode={teacherMode} domain={domain} lockPredicateValue={lockPredicateValue} predicates={predicates} setPredicateValueTable={setPredicateValueTable} setPredicateValueText={setPredicateValueText} toggleTable={toggleTable} lengthOfCol={12}/>
            </Row>
         )}
         {functions.length === 0 ? null : (
            <Row>
                <FunctionInterpretation toggleTable={toggleTable} domain={domain} teacherMode={teacherMode} structure={structure} structureObject={structureObject} functions={functions} lockFunctionValue={lockFunctionValue} setFunctionValueTable={setFunctionValueTable} setFunctionValueText={setFunctionValueText} lengthOfCol={12}/>
            </Row>
         )}

         <Row>
           <DatabaseTable domain={domain} toggleTable={toggleTable} teacherMode={teacherMode} structure={structure} structureObject={structureObject} functions={functions} lockFunctionValue={lockFunctionValue} setFunctionValueTable={setFunctionValueTable} setFunctionValueText={setFunctionValueText} lengthOfCol={12}/>
         </Row>
       </Panel.Body>
     </Panel>


  )
}

export default Structure;