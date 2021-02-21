import React from 'react';
import FontAwesome from 'react-fontawesome';
import {Button} from "react-bootstrap";

const HenkinHintikkaGameButton = ({onClick,enabled}) => (
    <Button onClick={() => onClick()} variant={"outline-secondary"} className={"btn-with-border "+(enabled?"active":"")}>
        <FontAwesome name='fas fa-gamepad'/>
    </Button>
);
export default HenkinHintikkaGameButton;