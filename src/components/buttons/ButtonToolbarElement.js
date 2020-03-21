import React from 'react';
import FontAwesome from 'react-fontawesome';
import {Button, ButtonToolbar, Modal} from "react-bootstrap";
import DownloadButton from "../lib/DownloadButton";
import {DEFAULT_FILE_NAME} from "../../constants";

const ButtonToolbarElement = ({exportState,setExerciseNameState,modalShowState,diagramToggledState,teacherModeState,setDiagramToggledState, setModelShowState, importState, setTeacherModeState}) => (
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

        <Modal show={modalShowState} onHide={() => setModelShowState(false)}>
            <Modal.Header>
                <Modal.Title>Uložiť štruktúru</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='form-inline'>
                    <div className='form-group'>
                        <label className='exercise-name-label' htmlFor="exercise-name">Cvičenie: </label>
                        <input type="text" className="exercise-name-input form-control" id="exercise-name"
                               placeholder={DEFAULT_FILE_NAME}
                               onChange={(e) => setExerciseNameState(e.target.value)}/>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <DownloadButton genFile={exportState} downloadTitle='Uložiť'
                                className='btn btn-success'/>
                <Button bsStyle='primary' onClick={() => setModelShowState(false)}>Zrušiť</Button>
            </Modal.Footer>
        </Modal>

        <button title="Učiteľský mód" className='btn btn-outline-primary btn-lg' onClick={() => setTeacherModeState()} style={teacherModeState?{color:"white",backgroundColor:"#28a745"}:{color:"black",backgroundColor:"white",hover:{color:"white" ,backgroundColor:"#28a745"}}}>
            <FontAwesome name='fas fa-user-edit'/>
        </button>
    </ButtonToolbar>
);

export default ButtonToolbarElement;