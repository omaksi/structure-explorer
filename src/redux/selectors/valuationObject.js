import { createSelector } from 'reselect'

const getParsedValuation = state => state.structure.variables.parsed

export const getValuationObject = createSelector(
    [getParsedValuation],
    (valuations) => {
        return new Map(valuations);
    }
)