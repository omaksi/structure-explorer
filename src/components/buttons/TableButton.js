import React from 'react';
import FontAwesome from 'react-fontawesome';
import {Button} from "react-bootstrap";

const TableButton = ({onClick,enabled}) => (
   <Button onClick={() => onClick()} className={enabled?"buttonSelected":"buttonNotSelected"}>
     <FontAwesome name='table'/>
   </Button>
);

{/*style={enabled?{background:"black"}:{background:"#dddddd",color:"black", borderColor:"#dddddd"}*/}
export default TableButton;