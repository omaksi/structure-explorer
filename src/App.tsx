import './App.css';
import React from 'react';
import {Col, Row, Modal, Button} from 'react-bootstrap';
import {createStore} from 'redux';
import reducer from './reducers';
import {Provider} from 'react-redux';
import ExpressionsContainer from './containers/ExpressionsContainer';
import DownloadButton from './components/lib/DownloadButton';
import {toggleTeacherMode} from "./actions";
import {importAppState} from "./actions";
import {DEFAULT_FILE_NAME} from "./constants";
import {Application} from "./diagram/Application";
import DiagramModelContainer from "./containers/DiagramModelContainer";
import MathSystemContainer from './containers/MathSystemContainer';
import ButtonToolbarElement from "./components/buttons/ButtonToolbarElement";
import BootstrapSwitchButton from "bootstrap-switch-button-react/lib/bootstrap-switch-button-react";


// @ts-ignore
const store = createStore(reducer);

store.subscribe(() => {
  let state = store.getState();
});

interface IProps{

}

interface IState {
  modalShow:boolean;
  diagramToggled:boolean;
  exerciseName:string;
}

class App extends React.Component<IProps,IState> {

  constructor(props:IProps) {
    super(props);

    this.state = {
      modalShow: false,
      diagramToggled:true,
      exerciseName:''
    };

    this.exportState = this.exportState.bind(this);
    this.importState = this.importState.bind(this);
    this.setModelShowState = this.setModelShowState.bind(this);
    this.setDiagramToggledState = this.setDiagramToggledState.bind(this);
  }


  exportState() {
    let state = store.getState();
    let json = JSON.stringify({
      common: state.common,
      language: state.language,
      structure: state.structure,
      expressions: state.expressions
    });

    return {
        mime: 'application/json',
        filename: this.state.exerciseName.length === 0? (DEFAULT_FILE_NAME + '.json'):(this.state.exerciseName+'.json'),
        contents: json
      }
    }

  importState(e:any) {
    let file = e.target.files[0];
    let fr = new FileReader();
    fr.onload = function (e) {
      store.dispatch(importAppState(e.target.result));
    };
    fr.readAsText(file);
  }

  setModelShowState(bool:boolean){
    this.setState({modalShow: bool});
  }

  setDiagramToggledState(bool:boolean){
    this.setState({diagramToggled: bool});
  }

  setTeacherModeState(){
    store.dispatch(toggleTeacherMode());
  }

  render() {
    return (
        <Provider store={store}>
          <div className='app'>
            <Row>
              <div className='toolbar'>
                <div className='col-xs-7 toolbar-import-export'>
                  <ButtonToolbarElement diagramToggledState={this.state.diagramToggled} teacherModeState={store.getState().common.teacherMode} setTeacherModeState={this.setTeacherModeState} setDiagramToggledState={this.setDiagramToggledState} setModelShowState={this.setModelShowState} importState={this.importState}/>
                </div>
                <div className='col-xs-5 toolbar-mode-toggle'>

                  <BootstrapSwitchButton
                      checked={false}
                      onlabel='On'
                      onstyle='outline-success'
                      offlabel='Off'
                      offstyle='outline-light'
                      onChange={() => store.dispatch(toggleTeacherMode())}
                  />

                </div>
               <Modal show={this.state.modalShow} onHide={() => this.setState({modalShow: false})}>
                  <Modal.Header>
                    <Modal.Title>Uložiť štruktúru</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div className='form-inline'>
                      <div className='form-group'>
                        <label className='exercise-name-label' htmlFor="exercise-name">Cvičenie: </label>
                        <input type="text" className="exercise-name-input form-control" id="exercise-name"
                               placeholder={DEFAULT_FILE_NAME}
                               onChange={(e) => this.setState({exerciseName: e.target.value})}/>
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <DownloadButton genFile={this.exportState} downloadTitle='Uložiť'
                                    className='btn btn-success'/>
                    <Button bsStyle='primary' onClick={() => this.setState({modalShow: false})}>Zrušiť</Button>
                  </Modal.Footer>
                </Modal>
              </div>
            </Row>

              {!this.state.diagramToggled? (
                  <MathSystemContainer/>
                  ):
                    <Col sm={12} className='reactDiagram'>
                      <DiagramModelContainer app={new Application(store.getState().diagramNodeState.diagramModel)}/>
                    </Col>
              }
            <Row>
              <Col sm={12}>
                <ExpressionsContainer/>
              </Col>
            </Row>
          </div>
        </Provider>
    );
  }
}

export default App;
