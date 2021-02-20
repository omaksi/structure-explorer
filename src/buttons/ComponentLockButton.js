import React from 'react';
import FontAwesome from 'react-fontawesome';
import {Button} from "react-bootstrap";

const ComponentLockButton = ({lockFn, locked}) => (
    <Button style={{padding:"0.2rem 0.4rem"}} variant={'secondary'} size={"sm"} title='ReadOnly' className={(locked?'active':'') + ' mr-2'} onClick={() => lockFn()}>
        <FontAwesome name={locked ? 'fas fa-edit' : 'far fa-save'}/>
        <span>&nbsp;{locked ? 'Editovať' : 'Uložiť'}</span>
    </Button>
);

export default ComponentLockButton;