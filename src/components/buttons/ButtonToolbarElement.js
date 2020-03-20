import React from 'react';
import FontAwesome from 'react-fontawesome';
import {ButtonToolbar} from "react-bootstrap";

const ButtonToolbarElement = ({diagramToggledState,teacherModeState,setDiagramToggledState, setModelShowState, importState, setTeacherModeState}) => (
    <ButtonToolbar>
        <button className={'btn btn-outline-primary btn-lg'+(diagramToggledState?'':' active')} onClick={() => setDiagramToggledState(false)}>
            <FontAwesome name='fas fa-list'/>
        </button>

        <button className={'btn btn-outline-primary btn-lg'+(diagramToggledState?' active':'')} onClick={() => setDiagramToggledState(true)}>
            <FontAwesome name='fas fa-project-diagram'/>
        </button>

        <button className='btn btn-outline-primary btn-lg' onClick={() => setModelShowState(true)}>
            <FontAwesome name='fas fa-file-export'/>
            {/*<span className='toolbar-btn-label-1'>Uložiť</span>
            <span className='toolbar-btn-label-2'>cvičenie</span>*/}
        </button>

        <button className='btn btn-outline-primary btn-lg'
                onClick={() => document.getElementById("uploadInput").click()}>
            <FontAwesome name='fas fa-file-import'/>
            {/*<span className='toolbar-btn-label-1'>Importovať</span>
            <span className='toolbar-btn-label-2'>cvičenie</span>*/}
            <input id="uploadInput" type="file" name='jsonFile'
                   onChange={(e) => {
                       importState(e);
                   }}
                   hidden={true}
                   style={{display: 'none'}}/>
        </button>

        <button className='btn btn-teacher btn-outline-primary btn-lg' onClick={() => setTeacherModeState()} style={teacherModeState?{color:"white",backgroundColor:"#28a745"}:{color:"black",backgroundColor:"white"}}>
            <FontAwesome name='fas fa-user-edit'/>
            {/*<span className='toolbar-btn-label-1'>Uložiť</span>
            <span className='toolbar-btn-label-2'>cvičenie</span>*/}
        </button>
    </ButtonToolbar>
);

export default ButtonToolbarElement;