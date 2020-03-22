import React from 'react';
import {Col, FormGroup, Form, Row} from "react-bootstrap";
import Card from "react-bootstrap/Card";
import TextInput from "../components_parts/TextInput";
import HelpButton from "../buttons/HelpButton";

const help = (
   <div className="collapse" id="help-variables">
     <div className="well">
       Tu sa definujú hodnoty premenných. Za premennú sa považuje každý symbol, ktorý nie je v jazyku. Syntax
       zapisovania má formát <code>(premenná, hodnota)</code>.
     </div>
   </div>
);

const VariablesValue = (props) => (
   <Card className={"no-border-radius"}>
     <Card.Header>
       <Card.Title componentClass='h2'>Ohodnotenie premenných</Card.Title>
         <HelpButton dataTarget={"#help-variables"}/>
     </Card.Header>
     <Card.Body>
       {help}
       <Row>
         <Col lg={12}>
           <fieldset>
             <legend>Ohodnotenie premenných</legend>
             <FormGroup
                validationState={props.variables.errorMessage.length > 0 ? 'error' : null}>
               <TextInput onChange={(e) => props.onInputChange(e.target.value)}
                          onLock={() => props.lockInput()}
                          textData={props.variables}
                          label={<span><var>e</var> = &#123;</span>}
                          teacherMode={props.teacherMode}
                          id='editor-variables'
                          placeholder='(x,1), (y,2), (z,3), ...'/>
               <Form.Text className={props.variables.errorMessage.length === 0?"":"alert alert-danger"}>{props.variables.errorMessage}</Form.Text>
             </FormGroup>
           </fieldset>
         </Col>
       </Row>
     </Card.Body>
   </Card>
);

export default VariablesValue;