import React from 'react';
import FontAwesome from 'react-fontawesome';
import {Button} from "react-bootstrap";

const TableButton = ({onClick,enabled}) => (
   <Button onClick={() => onClick()} variant={"outline-secondary"} className={"btn-with-border "+(enabled?"active":"")}>
     <FontAwesome name='fas fa-table'/>
   </Button>
);
export default TableButton;