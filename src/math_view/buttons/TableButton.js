import React from 'react';
import FontAwesome from 'react-fontawesome';
import {Button} from "react-bootstrap";

const TableButton = ({onClick,enabled}) => (
   <Button onClick={() => onClick()} className={enabled?"buttonSelected":"buttonNotSelected"}>
     <FontAwesome name='fas fa-table'/>
   </Button>
);
export default TableButton;