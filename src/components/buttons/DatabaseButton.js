import React from 'react';
import FontAwesome from 'react-fontawesome';
import {Button} from "react-bootstrap";

const DatabaseButton = ({onClick,enabled}) => (
    <Button onClick={() => onClick()} style={enabled?{background:"black"}:{background:"#dddddd",color:"black", borderColor:"#dddddd"}}>
        <FontAwesome name='database'/>
    </Button>
);

export default DatabaseButton;