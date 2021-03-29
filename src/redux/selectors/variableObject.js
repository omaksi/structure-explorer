import { createSelector } from 'reselect'

const getParsedVariables = state => state.structure.variables.parsed

export const getVariableObject = createSelector(
    [getParsedVariables],
    (variables) => {
        let variableMap = new Map();
        variables.forEach(variable => variableMap.set(variable[0], variable[1]));
        return variableMap;
    }
)