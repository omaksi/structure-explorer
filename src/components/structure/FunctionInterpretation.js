import {Col, FormGroup, HelpBlock, Row} from "react-bootstrap";
import TextInput from "../inputs/TextInput";
import {FUNCTION} from "../../constants";
import RelationalTable from "../RelationalTable";
import React from "react";
import DatabaseFunction from "./DatabaseFunctionTable";

function FunctionInterpretation({functions,structure,setFunctionValueText,lockFunctionValue,toggleTable,toggleDatabase,teacherMode,domain,structureObject,setFunctionValueTable,lengthOfCol}){
    return(
        <Col lg={lengthOfCol}>
            <fieldset>
                <legend>Interpretácia funkčných symbolov</legend>
                {functions.map((name) =>
                    <FormGroup
                        validationState={structure.functions[name].errorMessage.length > 0 ? 'error' : null}>
                        <TextInput onChange={(e) => setFunctionValueText(e.target.value, name)}
                                   onLock={() => lockFunctionValue(name)}
                                   textData={structure.functions[name]}
                                   label={<span><var>i</var>({name.split('/')[0]}) = &#123;</span>}
                                   teacherMode={teacherMode}
                                   id={'function-' + name}
                                   toggleTable={() => toggleTable(FUNCTION, name)}
                                   toggleDatabase={() => toggleDatabase(FUNCTION, name)}
                                   databaseEnabled={structure.functions[name].databaseEnabled}
                                   tableEnabled={structure.functions[name].tableEnabled}
                                   arity={parseInt(name.split('/')[1])}
                                   domain={domain}
                                   placeholder='(1,2), (2,2), (3,1), ...'/>
                        {structure.functions[name].tableEnabled && domain.length > 0 ? (
                            <RelationalTable name={name} domain={structureObject.domain}
                                             arity={structureObject.language.getFunction(name.split('/')[0])}
                                             value={structureObject.iFunction.has(name) ? structureObject.iFunction.get(name) : {}}
                                             onInputChange={setFunctionValueTable}
                                             disabled={structure.functions[name].locked}
                                             type={FUNCTION}/>
                        ) : null}
                        {structure.functions[name].databaseEnabled && domain.length > 0 ? (
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
    )
}
export default FunctionInterpretation;