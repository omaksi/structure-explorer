import './App.css';
import React from 'react';
import {Col, Row} from 'react-bootstrap';
import {Provider} from 'react-redux';
import ExpressionsContainer from './redux/containers/ExpressionsContainer';
import {importAppState} from "./redux/actions";
import {DEFAULT_FILE_NAME} from "./constants";
import DiagramModelContainer from "./redux/containers/DiagramModelContainer";
import MathSystemContainer from './redux/containers/MathSystemContainer';
import ButtonToolbarComponent from "./math_view/buttons/ButtonToolbarComponent";

interface AppProps{
  store:any;
  teacherMode:boolean;
  toggleTeacherMode:any;
}

interface AppState {
  modalShow:boolean;
  diagramToggled:boolean;
  exerciseName:string;
}

class App extends React.Component<AppProps,AppState> {
  constructor(props:AppProps) {
    super(props);

    this.state = {
      modalShow: false,
      diagramToggled:true,
      exerciseName:''
    };

    this.props.store.subscribe(() => {
      let state = this.props.store.getState();
      console.log('STATE:', state);
    });

    this.exportState = this.exportState.bind(this);
    this.importState = this.importState.bind(this);
    this.setModelShowState = this.setModelShowState.bind(this);
    this.setDiagramToggledState = this.setDiagramToggledState.bind(this);
    this.setTeacherModeState = this.setTeacherModeState.bind(this);
    this.setExerciseNameState = this.setExerciseNameState.bind(this);
  }


  exportState() {
    let state = this.props.store.getState();
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

    let store = this.props.store;
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

  setExerciseNameState(name:string){
    this.setState({exerciseName:name});
  }

  setTeacherModeState(){
    this.props.toggleTeacherMode();
  }

  render() {
    return (
        <Provider store={this.props.store}>
          <div className='app'>
            <Row className={'navbar'}>
                  <ButtonToolbarComponent exportState={this.exportState} setExerciseNameState={this.setExerciseNameState} modalShowState={this.state.modalShow} diagramToggledState={this.state.diagramToggled} teacherModeState={this.props.teacherMode} setTeacherModeState={this.setTeacherModeState} setDiagramToggledState={this.setDiagramToggledState} setModelShowState={this.setModelShowState} importState={this.importState}/>
            </Row>
              {!this.state.diagramToggled? (
                  <MathSystemContainer/>
                  ):
                  <Row className='reactDiagram'>
                    <Col sm={12} >
                      <DiagramModelContainer/>
                    </Col>
                  </Row>
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
