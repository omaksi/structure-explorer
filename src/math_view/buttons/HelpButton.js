import React from 'react';
import {Button} from "react-bootstrap";
import FontAwesome from "react-fontawesome";

const HelpButton = ({dataTarget}) => (
    <Button style={{padding:"0.2rem 0.4rem"}} variant={'secondary'} size={"sm"} title='Pomoc' data-toggle='collapse' data-target={dataTarget} aria-expanded='false' aria-controls='collapseExample'>
        <FontAwesome name='fas fa-question'/>
    </Button>
);

export default HelpButton;
