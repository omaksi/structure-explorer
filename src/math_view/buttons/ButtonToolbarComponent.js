import React from 'react';
import FontAwesome from 'react-fontawesome';
import {ButtonToolbar} from "react-bootstrap";
import ModalComponent from "../components_parts/ModalComponent";

const ButtonToolbarComponent = ({exportState,setExerciseNameState,modalShowState,diagramToggledState,teacherModeState,setDiagramToggledState, setModelShowState, importState, setTeacherModeState}) => (
    <ButtonToolbar>
        <button title="Prepnúť na matematický pohľad" className={'btn btn-outline-primary btn-lg'+(diagramToggledState?'':' active')} onClick={() => setDiagramToggledState(false)}>
            <FontAwesome name='fas fa-list'/>
        </button>

        <button title="Prepnúť na grafový pohľad" className={'btn btn-outline-primary btn-lg'+(diagramToggledState?' active':'')} onClick={() => setDiagramToggledState(true)}>
            <FontAwesome name='fas fa-project-diagram'/>
        </button>

        <button title="Exportovať cvičenie" className='btn btn-outline-primary btn-lg' onClick={() => setModelShowState(true)}>
            <FontAwesome name='fas fa-file-export'/>
        </button>

        <button title="Importovať cvičenie" className='btn btn-outline-primary btn-lg'
                onClick={() => document.getElementById("uploadInput").click()}>
            <FontAwesome name='fas fa-file-import'/>
            <input id="uploadInput" type="file" name='jsonFile'
                   onChange={(e) => {
                       importState(e);
                   }}
                   hidden={true}
                   style={{display: 'none'}}/>
        </button>

        <ModalComponent exportState={exportState} modalShowState={modalShowState} setExerciseNameState={setExerciseNameState} setModalShowState={setModelShowState}/>

        <button title="Učiteľský mód" className='btn btn-outline-success btn-lg' onClick={() => setTeacherModeState()} style={teacherModeState?{color:"white",backgroundColor:"#28a745"}:{color:"black",backgroundColor:"white",hover:{color:"white" ,backgroundColor:"#28a745"}}}>
            <FontAwesome name='fas fa-user-edit'/>
        </button>
    </ButtonToolbar>
);

export default ButtonToolbarComponent;