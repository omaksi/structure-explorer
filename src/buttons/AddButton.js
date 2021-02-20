import React from 'react';
import {Button} from "react-bootstrap";
import FontAwesome from "react-fontawesome";

const AddButton = ({onClickAddFunction,addType}) => (
    <Button variant={"success"} title={"Pridaj"} onClick={() => onClickAddFunction(addType)}><FontAwesome
        name='plus'/>
        &nbsp;Pridať
    </Button>
);

export default AddButton;
