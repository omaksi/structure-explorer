import Structure from "../model/Structure";
import Language from "../model/Language";
import languageReducer from "./language";
import structureReducer from "./structure";
import expressionsReducer from "./expressions";
import teacherModeReducer from "./teacherMode";
import {IMPORT_APP} from "../constants/action_types";
import {defaultInputData} from "../constants";
import {EMPTY_DOMAIN} from "../constants/messages";
import {DiagramModel} from "@projectstorm/react-diagrams";
import diagramReducer from "./diagram";

const defaultState = {
    structureObject: new Structure(new Language()),
    common: {
        teacherMode: false
    },
    language: {
        constants: defaultInputData(),
        predicates: defaultInputData(),
        functions: defaultInputData(),
    },
    structure: {
        constants: {},
        predicates: {},
        functions: {},
        variables: {...defaultInputData(), object: new Map()},
        domain: {...defaultInputData(), errorMessage: EMPTY_DOMAIN},
    },
    expressions: {
        // @ts-ignore
        formulas: [],
        // @ts-ignore
        terms: []
    },
    diagramModel: new DiagramModel()
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
            state.structureObject = new Structure(new Language());
            state.structure.variables.object = new Map();
        } catch (e) {
            console.error(e);
        }
        state.diagramModel = new DiagramModel();
    }
    let common = teacherModeReducer(state.common, action);
    let language = languageReducer(state.language, action, state.structureObject);
    let structure = structureReducer(state.structure, action, state.structureObject);
    let expressions = expressionsReducer(state.expressions, action, state.structureObject, state.structure.variables.object);
    let diagramModel = diagramReducer(state.diagramModel,action);

    return {
        structureObject: state.structureObject,
        common: common,
        language: language,
        structure: structure,
        expressions: expressions,
        diagramModel:diagramModel
    }
}

export default root;