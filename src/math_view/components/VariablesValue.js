import React from 'react';
import {Col, Form, Row} from "react-bootstrap";
import Card from "react-bootstrap/Card";
import TextInput from "../components_parts/TextInput";
import HelpButton from "../../buttons/HelpButton";
import ComponentLockButton from "../../buttons/ComponentLockButton";

const help = (
   <div className="collapse" id="help-variables">
     <div className="well">
       Tu sa definujú hodnoty premenných. Za premennú sa považuje každý symbol, ktorý nie je v jazyku. Syntax
       zapisovania má formát <code>(premenná, hodnota)</code>.
     </div>
   </div>
);

const VariablesValue = (props) => (
   <Card className={"mt-3"}>
     <Card.Header as="h5" className={"d-flex justify-content-between"}>
       <span>Ohodnotenie premenných</span>
       <HelpButton dataTarget={"#help-variables"}/>
     </Card.Header>
     <Card.Body>
       {help}
         <Row>
             <Col lg={12}>
                 <Form.Group>
                     <Form.Label>Ohodnotenie premenných</Form.Label>
                     <TextInput
                         errorProperty={props.variables.errorMessage}
                         onChange={(e) => props.onInputChange(e.target.value)}
                         onLock={() => props.lockInput()}
                         textData={props.variables}
                         label={<span><var>e</var> = &#123;</span>}
                         teacherMode={props.teacherMode}
                         id='editor-variables'
                         placeholder='(x,1), (y,2), (z,3), ...'/>
                 </Form.Group>
             </Col>
         </Row>
     </Card.Body>
   </Card>
);

export default VariablesValue;