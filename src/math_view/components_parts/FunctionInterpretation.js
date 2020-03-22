import {Col, FormGroup, Form} from "react-bootstrap";
import TextInput from "./TextInput";
import {FUNCTION} from "../../constants";
import React from "react";
import DatabaseFunction from "./DatabaseFunction";
import {RelationalTable} from './index'

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
                        <Form.Text className={structure.functions[name].errorMessage.length === 0?"":"alert alert-danger"}>{structure.functions[name].errorMessage}</Form.Text>
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
                                              symbol={name.split('/')[0]}
                                              value={structureObject.iFunction.has(name) ? structureObject.iFunction.get(name) : {}}
                                              onInputChange={setFunctionValueTable}
                                              disabled={structure.functions[name].locked}
                                              type={FUNCTION}/>
                        ) : null}
                    </FormGroup>
                )}
            </fieldset>
        </Col>
    )
}
export default FunctionInterpretation;