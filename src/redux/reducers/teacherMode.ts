import {TOGGLE_TEACHER_MODE} from "../actions/action_types";
import produce from "immer";

const teacherModeReducer = produce((state:any, action:any) => {
    if (action.type === TOGGLE_TEACHER_MODE) {
        state.teacherMode = !state.teacherMode;
        return state;
    } else {
        return state;
    }
})

export default teacherModeReducer;