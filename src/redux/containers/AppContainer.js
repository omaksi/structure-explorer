import {connect} from 'react-redux';
import App from "../../App";
import {toggleTeacherMode} from "../actions";

const mapStateToProps = (state) => ({
    teacherMode:state.common.teacherMode
});

const mapDispatchOnProps = {
    toggleTeacherMode:toggleTeacherMode
};

const AppContainer = connect(
    mapStateToProps,
    mapDispatchOnProps
)(App);

export default AppContainer;