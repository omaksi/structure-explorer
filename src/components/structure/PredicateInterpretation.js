import {Col, FormGroup, HelpBlock} from "react-bootstrap";
import TextInput from "../inputs/TextInput";
import {PREDICATE} from "../../constants";
import RelationalTable from "../RelationalTable";
import React from "react";

function PredicateInterpretation({structure,predicates,setPredicateValueText,lockPredicateValue,toggleTable,domain,setPredicateValueTable,structureObject,teacherMode,lengthOfCol}){
    return(
        <Col lg={lengthOfCol}>
            <fieldset>
                <legend>Interpretácia predikátových symbolov</legend>
                {predicates.map((name) =>
                    <FormGroup
                        validationState={structure.predicates[name].errorMessage.length > 0 ? 'error' : null}>
                        <TextInput onChange={(e) => setPredicateValueText(e.target.value, name)}
                                   onLock={() => lockPredicateValue(name)}
                                   textData={structure.predicates[name]}
                                   label={<span><var>i</var>({name.split('/')[0]}) = &#123;</span>}
                                   teacherMode={teacherMode}
                                   id={'predicate-' + name}
                                   toggleTable={() => toggleTable(PREDICATE, name)}
                                   arity={parseInt(name.split('/')[1])}
                                   domain={domain}
                                   placeholder='(1,2), (2,2), (3,1), ...'/>
                        {structure.predicates[name].tableEnabled && domain.length > 0 ? (
                            <RelationalTable name={name} domain={structureObject.domain}
                                             arity={structureObject.language.getPredicate(name.split('/')[0])}
                                             value={structureObject.iPredicate.get(name) ? structureObject.iPredicate.get(name) : []}
                                             onInputChange={setPredicateValueTable}
                                             type={PREDICATE}
                                             disabled={structure.predicates[name].locked}/>
                        ) : null}
                        <HelpBlock>{structure.predicates[name].errorMessage}</HelpBlock>
                    </FormGroup>
                )}
            </fieldset>
        </Col>
    )
}
export default PredicateInterpretation;