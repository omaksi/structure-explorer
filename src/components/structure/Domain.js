import {Col, FormGroup, HelpBlock} from "react-bootstrap";
import TextInput from "../inputs/TextInput";
import React from "react";

function Domain({structure,setDomain,lockDomain,teacherMode,lengthOfCol}){
    return(
        <Col lg={lengthOfCol}>
        <fieldset>
            <legend>Doména</legend>
            <FormGroup
                validationState={structure.domain.errorMessage.length > 0 ? 'error' : null}>
                <TextInput onChange={(e) => setDomain(e.target.value)}
                           onLock={() => lockDomain()}
                           textData={structure.domain}
                           label={<span><var>M</var> = &#123;</span>}
                           teacherMode={teacherMode}
                           id='language-editor-domain'
                           placeholder='1, 2, 3, 🐶, ...'/>
                <HelpBlock>{structure.domain.errorMessage}</HelpBlock>
            </FormGroup>
        </fieldset>
        </Col>
    )
}

export default Domain;