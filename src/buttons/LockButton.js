import React from 'react';
import FontAwesome from 'react-fontawesome';
import {Button} from "react-bootstrap";

const LockButton = ({lockFn, locked}) => (
   <Button variant={'outline-secondary'} className={locked?'active':''} onClick={() => lockFn()}>
     <FontAwesome name={locked ? 'unlock' : 'lock'}/>
   </Button>
);

export default LockButton;