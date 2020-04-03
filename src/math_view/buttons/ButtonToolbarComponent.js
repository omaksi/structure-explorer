import React from 'react';
import FontAwesome from 'react-fontawesome';
import {Button, ButtonGroup, ButtonToolbar, Form} from 'react-bootstrap';
import ModalComponent from '../components_parts/ModalComponent';

const ButtonToolbarComponent = ({exportState,setExerciseNameState,modalShowState,diagramToggledState,teacherModeState,setDiagramToggledState, setModelShowState, importState, setTeacherModeState}) => (
    <ButtonToolbar>

        <ButtonGroup className='mr-lg-2'>
        <Button variant='outline-primary' size='lg' title='Prepnúť na matematický pohľad' className={diagramToggledState?'':' active'} onClick={() => setDiagramToggledState(false)}>
            <FontAwesome name='fas fa-list'/>
            <span className={'hidden-on-medium-and-lower'}>&nbsp;Matematika</span>
        </Button>

        <Button variant='outline-primary' size='lg' title='Prepnúť na grafový pohľad' className={diagramToggledState?' active':''} onClick={() => setDiagramToggledState(true)}>
            <FontAwesome name='fas fa-project-diagram'/>
            <span className={'hidden-on-medium-and-lower'}>&nbsp;Graf</span>
        </Button>
        </ButtonGroup>

        <ButtonGroup className='mr-lg-2'>
        <Button variant='secondary' size='lg' title='Exportovať cvičenie' onClick={() => setModelShowState(true)}>
            <FontAwesome name='fas fa-file-export'/>
            <span className={'hidden-on-medium-and-lower'}>&nbsp;Exportovať</span>
        </Button>

        <Button variant='secondary' size='lg' title='Importovať cvičenie'
                onClick={() => document.getElementById('uploadInput').click()}>
            <FontAwesome name='fas fa-file-import'/>
            <input id='uploadInput' type='file' name='jsonFile'
                   onChange={(e) => {
                       importState(e);
                   }}
                   hidden={true}
                   style={{display: 'none'}}/>
            <span className={'hidden-on-medium-and-lower'}>&nbsp;Importovať</span>
        </Button>
        </ButtonGroup>

        <ModalComponent exportState={exportState} modalShowState={modalShowState} setExerciseNameState={setExerciseNameState} setModalShowState={setModelShowState}/>

        <ButtonGroup>
        <Button variant={'outline-success'} size='lg' title='Učiteľský mód' className={(teacherModeState?'active':'')} onClick={() => setTeacherModeState()}>
            <FontAwesome name='fas fa-user-edit'/>
            <span className={'hidden-on-medium-and-lower'}>&nbsp;Učiteľský mód</span>
        </Button>
        </ButtonGroup>
    </ButtonToolbar>
);

export default ButtonToolbarComponent;