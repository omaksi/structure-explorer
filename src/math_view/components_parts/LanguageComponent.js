import {Col, FormGroup, Form, Row} from "react-bootstrap";
import TextInput from "./TextInput";
import React from "react";

function LanguageComponent({legendText,onChangeSetFunction,onLockFunction,textData,textInputLabel,idName,placeholderText,errorProperty,teacherMode}){
    return(
        <Row>
            <Col lg={12}>
                <fieldset>
                    <legend>{legendText}</legend>
                    <FormGroup
                        validationState={errorProperty.length > 0 ? 'error' : null}>
                        <TextInput onChange={(e) => onChangeSetFunction(e.target.value)}
                                   onLock={() => onLockFunction()}
                                   textData={textData}
                                   label={textInputLabel}
                                   teacherMode={teacherMode}
                                   id={idName}
                                   placeholder={placeholderText}/>
                        <Form.Text className={errorProperty.length === 0?"":"alert alert-danger"}>{errorProperty}</Form.Text>
                    </FormGroup>
                </fieldset>
            </Col>
        </Row>
    )
}

export default LanguageComponent;