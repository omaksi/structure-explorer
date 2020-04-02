import React from 'react';
import {Button} from "react-bootstrap";

const HelpButton = ({dataTarget}) => (
    <Button variant={'secondary'} title='Pomoc' data-toggle='collapse' data-target={dataTarget} aria-expanded='false' aria-controls='collapseExample'>?</Button>
);

export default HelpButton;
