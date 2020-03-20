import {Col, FormGroup, Form, InputGroup} from "react-bootstrap";
import LockButton from "../buttons/LockButton";
import React from "react";

export function ConstantInterpretation({structure,setConstantValue,structureObject,teacherMode,lockConstantValue}){
    return(
    <Col lg={12}>
        <fieldset>
            <legend>Interpretácia symbolov konštánt</legend>
            {Object.keys(structure.constants).map((constant) =>
                <FormGroup
                    validationState={structure.constants[constant].errorMessage.length > 0 ? 'error' : null}>
                    <InputGroup>
                        <label className='input-group-addon'
                               htmlFor={'constant-' + constant}><var>i</var>({constant}) = </label>
                        <select value={structure.constants[constant].value}
                                id={'constant-' + constant}
                                className='form-control bootstrap-select'
                                onChange={(e) => setConstantValue(e.target.value, constant)}
                                disabled={structure.constants[constant].locked}>
                            <option value={''}>Vyber hodnotu ...</option>
                            {[...structureObject.domain].map((item) =>
                                <option value={item}>{item}</option>
                            )}
                        </select>
                        {teacherMode ? (
                            <InputGroup.Append>
                                <LockButton lockFn={() => lockConstantValue(constant)}
                                            locked={structure.constants[constant].locked}/>
                            </InputGroup.Append>
                        ) : null}
                    </InputGroup>
                    <Form.Text>{structure.constants[constant].errorMessage}</Form.Text>
                </FormGroup>
            )}
        </fieldset>
    </Col>
    )
}
