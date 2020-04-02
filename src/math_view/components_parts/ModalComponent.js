import React from 'react';
import {Button, Modal} from "react-bootstrap";
import DownloadButton from "../buttons/DownloadButton";
import {DEFAULT_FILE_NAME} from "../../constants";
import FontAwesome from "react-fontawesome";

const ModalComponent = ({modalShowState,setModalShowState,setExerciseNameState,exportState}) => (
    <Modal dialogClassName={"no-border-radius"} show={modalShowState} onHide={() => setModalShowState(false)}>
        <Modal.Header>
            <Modal.Title>Uložiť štruktúru</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className='form-inline'>
                <div className='form-group'>
                    <label htmlFor="exercise-name">Názov cvičenia: </label>
                    <input style={{borderRadius:0}} type="text" className="form-control" id="exercise-name"
                           placeholder={DEFAULT_FILE_NAME}
                           onChange={(e) => setExerciseNameState(e.target.value)}/>
                </div>
            </div>
        </Modal.Body>
        <Modal.Footer>
            <DownloadButton genFile={exportState} title={"Uložiť"}
                            className='btn btn-success'>
            </DownloadButton>

            <Button variant={"secondary"} title='Zrušiť' onClick={() => setModalShowState(false)}>
                <FontAwesome name='fas fa-window-close'/>
                &nbsp;Zrušiť
            </Button>

        </Modal.Footer>
    </Modal>
);

export default ModalComponent;