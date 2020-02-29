import {
    ADD_CONSTANT_NODE,
    ADD_DOMAIN_NODE,
    REMOVE_CONSTANT_NODE,
    REMOVE_DOMAIN_NODE,
    RESET_DIAGRAM_STATE
} from "../constants/action_types";

function diagramStateReducer(state, action) {
    switch (action.type) {
        case ADD_DOMAIN_NODE:
            return state;
        case ADD_CONSTANT_NODE:
            state.constantNodes.set(action.nodeName,action.nodeObject);
            return state;
        case REMOVE_DOMAIN_NODE:
            return state;
        case REMOVE_CONSTANT_NODE:
            state.constantNodes.delete(action.nodeName);
            console.log(state.constantNodes);
            return state;
        case RESET_DIAGRAM_STATE:
            state.domainNodes.clear();
            state.constantNodes.clear();
            state.functionNodes.clear();
            return state;
        default:
            return state;
    }
}

export default diagramStateReducer;