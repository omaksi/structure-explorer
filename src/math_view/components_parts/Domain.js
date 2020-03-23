import {Col, Form} from "react-bootstrap";
import TextInput from "./TextInput";
import React from "react";

function Domain({structure,setDomain,lockDomain,teacherMode,lengthOfCol}) {
    return (
        <Col lg={lengthOfCol}>
            <fieldset>
                <legend>Doména</legend>
                <Form.Group>
                    <TextInput
                        errorProperty={structure.domain.errorMessage}
                        onChange={(e) => setDomain(e.target.value)}
                        onLock={() => lockDomain()}
                        textData={structure.domain}
                        label={<span><var>M</var> = &#123;</span>}
                        teacherMode={teacherMode}
                        id='language-editor-domain'
                        placeholder='1, 2, 3, 🐶, ...'/>
                    <Form.Text
                        className={structure.domain.errorMessage.length === 0 ? "" : "alert alert-danger"}>{structure.domain.errorMessage}</Form.Text>
                </Form.Group>
            </fieldset>
        </Col>
    )
}

export default Domain;