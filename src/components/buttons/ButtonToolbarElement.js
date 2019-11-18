import React from 'react';
import FontAwesome from 'react-fontawesome';
import {ButtonToolbar} from "react-bootstrap";

const ButtonToolbarElement = ({onClick, onChange,hidden,style}) => (
    <ButtonToolbar>
        <button className='btn btn-lock' onClick={onClick}>
            <FontAwesome name='download'/>
            <span className='toolbar-btn-label-1'>Uložiť</span>
            <span className='toolbar-btn-label-2'>cvičenie</span>
        </button>
        <label className="btn btn-lock">
            <FontAwesome name='upload'/>
            <span className='toolbar-btn-label-1'>Importovať</span>
            <span className='toolbar-btn-label-2'>cvičenie</span>
            <input type="file" name='jsonFile'
                   onChange={onChange}
                   hidden={hidden}
                   style={style}/>
        </label>
    </ButtonToolbar>
);

export default ButtonToolbarElement;