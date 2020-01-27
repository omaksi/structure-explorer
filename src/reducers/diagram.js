import {SET_DIAGRAM} from "../constants/action_types";

function diagramReducer(state, action) {
  if (action.type === SET_DIAGRAM) {
    return action.state;
  } else {
    return state;
  }
}

export default diagramReducer;