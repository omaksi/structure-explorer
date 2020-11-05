import Structure from "../../math_view/model/Structure";
import Language from "../../math_view/model/Language";
import languageReducer from "./language";
import structureReducer from "./structure";
import expressionsReducer from "./expressions";
import teacherModeReducer from "./teacherMode";
import {IMPORT_APP} from "../actions/action_types";
import diagramReducer,{ defaultState as diagramDefaultState } from "./diagram";
import {defaultState as expressionsDefaultState} from "./expressions";
import {defaultState as structureDefaultState} from "./structure";
import {defaultState as languageDefaultState} from "./language";
import {getStructureObject} from "../selectors/structureObject";

const defaultState = {
    //structureObject: new Structure(new Language()),
    common: {
        teacherMode: false
    },
    language: languageDefaultState(),
    structure: structureDefaultState(),
    expressions: expressionsDefaultState(),
    diagramState:diagramDefaultState()
};

function checkImportedState(state:any) {
    if (!state.common || !state.language || !state.structure) {
        throw 'State is not valid!';
    }
    if (!state.language.constants || !state.language.predicates || !state.language.functions) {
        throw 'State is not valid!';
    }
}

function root(state = defaultState, action:any) {
    if (action.type === IMPORT_APP) {
        try {
            state = JSON.parse(action.content);
            checkImportedState(state);
            //state.structureObject = new Structure(new Language());
            state.structure.variables.object = new Map();
            state.diagramState = action.diagramState?action.diagramState:diagramDefaultState();
        } catch (e) {
            console.error(e);
        }

    }
    let common = teacherModeReducer(state.common, action);
    let language = languageReducer(state.language, action);
    let structure = structureReducer(state.structure, action);
    let expressions = expressionsReducer(state.expressions, action, state.structure.variables.object);
    let diagramState = diagramReducer(state.diagramState, action);

    return {
        //structureObject: state.structureObject,
        common: common,
        language: language,
        structure: structure,
        expressions: expressions,
        diagramState: diagramState
    }
}

export default root;