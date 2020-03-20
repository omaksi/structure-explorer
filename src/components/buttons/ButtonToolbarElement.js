import React from 'react';
import FontAwesome from 'react-fontawesome';
import {ButtonToolbar} from "react-bootstrap";

const ButtonToolbarElement = ({setDiagramToggledState, setModelShowState, importState}) => (
    <ButtonToolbar>
        <button className='btn btn-lock' onClick={() => setDiagramToggledState(false)}>
            <FontAwesome name='fas fa-list'/>
        </button>

        <button className='btn btn-lock' onClick={() => setDiagramToggledState(true)}>
            <FontAwesome name='fas fa-project-diagram'/>
        </button>

        <button className='btn btn-lock' onClick={() => setModelShowState(true)}>
            <FontAwesome name='fas fa-file-export'/>
            <span className='toolbar-btn-label-1'>Uložiť</span>
            <span className='toolbar-btn-label-2'>cvičenie</span>
        </button>
        <label className="btn btn-lock">
            <FontAwesome name='fas fa-file-import'/>
            <span className='toolbar-btn-label-1'>Importovať</span>
            <span className='toolbar-btn-label-2'>cvičenie</span>
            <input type="file" name='jsonFile'
                   onChange={(e) => importState(e)}
                   hidden={true}
                   style={{display: 'none'}}/>
        </label>
    </ButtonToolbar>
);

export default ButtonToolbarElement;