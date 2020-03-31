import React from 'react';
import {Button} from "react-bootstrap";
import FontAwesome from "react-fontawesome";

const AddButton = ({onClickAddFunction,addType}) => (
    <Button variant={"outline-success"} title={"Pridaj"} onClick={() => onClickAddFunction(addType)}><FontAwesome
        name='plus'/>
        &nbsp;Pridaj
    </Button>
);

export default AddButton;
