import React from 'react';
import {Button, Modal} from "react-bootstrap";
import DownloadButton from "../lib/DownloadButton";

const ModalElement = ({show,onHide,placeHolder,onChange,genFile,OnClick}) => (
    <Modal show={show} onHide={() => onHide}>
        <Modal.Header>
            <Modal.Title>Uložiť štruktúru</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className='form-inline'>
                <div className='form-group'>
                    <label className='exercise-name-label' htmlFor="exercise-name">Cvičenie: </label>
                    <input type="text" className="exercise-name-input form-control" id="exercise-name"
                           placeholder={placeHolder}
                           onChange={onChange}/>
                </div>
            </div>
        </Modal.Body>
        <Modal.Footer>
            <DownloadButton genFile={genFile} downloadTitle='Uložiť'
                            className='btn btn-success'/>
            <Button bsStyle='primary' onClick={OnClick}>Zrušiť</Button>
        </Modal.Footer>
    </Modal>
);

export default ModalElement;