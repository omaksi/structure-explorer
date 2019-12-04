import React from 'react';
import FontAwesome from 'react-fontawesome';
import {Button} from "react-bootstrap";

const DatabaseButton = ({onClick,enabled}) => (
    <Button onClick={() => onClick()} className={enabled?"buttonSelected":"buttonNotSelected"}>
        <FontAwesome name='database'/>
    </Button>
);

export default DatabaseButton;