import React from 'react';
import {Button} from "react-bootstrap";

const HelpButton = ({dataTarget}) => (
    <Button style={{padding:"0.0rem 0.5rem"}} variant={'secondary'} size={"sm"} title='Pomoc' data-toggle='collapse' data-target={dataTarget} aria-expanded='false' aria-controls='collapseExample'>?</Button>
);

export default HelpButton;
