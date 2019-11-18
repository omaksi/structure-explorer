import {TOGGLE_TEACHER_MODE} from "../constants/action_types";

function teacherModeReducer(state:any, action:any) {
    if (action.type === TOGGLE_TEACHER_MODE) {
        state.teacherMode = !state.teacherMode;
        return state;
    } else {
        return state;
    }
}

export default teacherModeReducer;