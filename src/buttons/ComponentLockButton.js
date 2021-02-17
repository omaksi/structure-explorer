import React from 'react';
import FontAwesome from 'react-fontawesome';
import {Button} from "react-bootstrap";

const ComponentLockButton = ({lockFn, locked}) => (
    <Button style={{padding:"0.2rem 0.4rem"}} variant={'secondary'} size={"sm"} title='ReadOnly' className={(locked?'active':'') + ' mr-3'} onClick={() => lockFn()}>
        <FontAwesome name={locked ? 'unlock' : 'lock'}/>
    </Button>
);

export default ComponentLockButton;