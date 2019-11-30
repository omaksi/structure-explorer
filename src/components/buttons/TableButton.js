import React from 'react';
import FontAwesome from 'react-fontawesome';
import {Button} from "react-bootstrap";

const TableButton = ({onClick,enabled}) => (
   <Button onClick={() => onClick()} style={enabled?{background:"black"}:{background:"#dddddd",color:"black", borderColor:"#dddddd"}}>
     <FontAwesome name='table'/>
   </Button>
);

export default TableButton;