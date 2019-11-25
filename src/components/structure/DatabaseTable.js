import {Col, FormGroup, HelpBlock} from "react-bootstrap";
import {FUNCTION, PREDICATE} from "../../constants";
import DatabaseFunction from "./DatabaseFunctionTable";
import React from "react";
import DatabasePredicate from "./DatabasePredicateTable";

function DatabaseTable({functions,structure,setFunctionValueText,lockFunctionValue,teacherMode,toggleTable,domain,structureObject,setFunctionValueTable,predicates, setPredicateValueTable, setPredicateValueText,lengthOfCol}) {
    return (
        <div>
        <Col lg={lengthOfCol}>
            <fieldset>
                {functions.map((name) =>
                    <FormGroup
                        validationState={structure.functions[name].errorMessage.length > 0 ? 'error' : null}>
                        {domain.length > 0 ? (
                            <DatabaseFunction name={name} domain={structureObject.domain}
                                              arity={structureObject.language.getFunction(name.split('/')[0])}
                                              value={structureObject.iFunction.has(name) ? structureObject.iFunction.get(name) : {}}
                                              onInputChange={setFunctionValueTable}
                                              disabled={structure.functions[name].locked}
                                              type={FUNCTION}/>
                        ) : null}
                        <HelpBlock>{structure.functions[name].errorMessage}</HelpBlock>
                    </FormGroup>
                )}
            </fieldset>
        </Col>
            <Col lg={lengthOfCol}>
                <fieldset>
                    {/*<legend>Databázová interpretácia predikátových symbolov</legend>*/}
                    {predicates.map((name) =>
                        <FormGroup
                            validationState={structure.predicates[name].errorMessage.length > 0 ? 'error' : null}>
                            {domain.length > 0 ? (
                                <DatabasePredicate name={name} domain={structureObject.domain} language={structureObject.language} predicates={predicates}
                                                  arity={structureObject.language.getPredicate(name.split('/')[0])}
                                                  value={structureObject.iPredicate.has(name) ? structureObject.iPredicate.get(name) : {}}
                                                  onInputChange={setPredicateValueTable}
                                                  disabled={structure.predicates[name].locked}
                                                  type={PREDICATE}/>
                            ) : null}
                            <HelpBlock>{structure.predicates[name].errorMessage}</HelpBlock>
                        </FormGroup>
                    )}
                </fieldset>
            </Col>
        </div>
    )
}

export default DatabaseTable;