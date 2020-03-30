import React from 'react';
import FontAwesome from 'react-fontawesome';
import {Button, ButtonGroup, ButtonToolbar} from 'react-bootstrap';
import ModalComponent from '../components_parts/ModalComponent';

const ButtonToolbarComponent = ({exportState,setExerciseNameState,modalShowState,diagramToggledState,teacherModeState,setDiagramToggledState, setModelShowState, importState, setTeacherModeState}) => (
    <ButtonToolbar>

        <ButtonGroup className='mr-lg-2'>
        <Button variant='outline-primary' size='lg' title='Prepnúť na matematický pohľad' className={diagramToggledState?'':' active'} onClick={() => setDiagramToggledState(false)}>
            <FontAwesome name='fas fa-list'/>
            Matematika
        </Button>

        <Button variant='outline-primary' size='lg' title='Prepnúť na grafový pohľad' className={diagramToggledState?' active':''} onClick={() => setDiagramToggledState(true)}>
            <FontAwesome name='fas fa-project-diagram'/>
            Graf
        </Button>
        </ButtonGroup>

        <ButtonGroup className='mr-lg-2'>
        <Button variant='outline-primary' size='lg' title='Exportovať cvičenie' onClick={() => setModelShowState(true)}>
            <FontAwesome name='fas fa-file-export'/>
            Exportovať
        </Button>

        <Button variant='outline-primary' size='lg' title='Importovať cvičenie'
                onClick={() => document.getElementById('uploadInput').click()}>
            <FontAwesome name='fas fa-file-import'/>
            <input id='uploadInput' type='file' name='jsonFile'
                   onChange={(e) => {
                       importState(e);
                   }}
                   hidden={true}
                   style={{display: 'none'}}/>
                   Importovať
        </Button>
        </ButtonGroup>

        <ModalComponent exportState={exportState} modalShowState={modalShowState} setExerciseNameState={setExerciseNameState} setModalShowState={setModelShowState}/>

        <ButtonGroup>
        <Button variant='outline-sucess' size='lg' title='Učiteľský mód' className={'teacher-mode-button btn-no-border'} onClick={() => setTeacherModeState()} style={teacherModeState?{color:'white',backgroundColor:'#28a745'}:{color:'black',backgroundColor:'white'}}>
            <FontAwesome name='fas fa-user-edit'/>
            Učiteľský mód
        </Button>
        </ButtonGroup>
    </ButtonToolbar>
);

export default ButtonToolbarComponent;