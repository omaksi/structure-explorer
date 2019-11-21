import React from 'react';
import {Table} from 'react-bootstrap';
import {PREDICATE} from "../../constants";


function renderFunctionValueSelect(functionName, functionValues, params, domain, onChange, disabled) {
    let value = functionValues[JSON.stringify(params)];
    if (!value) {
        value = '';
    }
    return (
        <select onChange={(e) => onChange(params.concat([e.target.value]), functionName)} value={value}>
            <option value=''>{''}</option>
            {domain.map(item =>
                <option disabled={disabled} value={item}>{item}</option>
            )}
        </select>
    )
}


function permutateWithRepetitions(permutationOptions,permutationLength = permutationOptions.length) {
    if (permutationLength === 1) {
        return permutationOptions.map(permutationOption => [permutationOption]);
    }

    // Init permutations array.
    const permutations = [];

    // Get smaller permutations.
    const smallerPermutations = permutateWithRepetitions(
        permutationOptions,
        permutationLength - 1,
    );

    // Go through all options and join it to the smaller permutations.
    permutationOptions.forEach((currentOption) => {
        smallerPermutations.forEach((smallerPermutation) => {
            permutations.push([currentOption].concat(smallerPermutation));
        });
    });
    return permutations;
}


function DatabaseFunction(props) {
    let domain = [...props.domain];
    let domainValueArray = [Object.values(domain)];

    let element = (
        <tbody>
        {permutateWithRepetitions(domainValueArray[0]).map((arrayValues) =>
            <tr>
                {arrayValues.map((value) =>
                    <td>
                        {value}
                    </td>
                )}
                <td>
                    {renderFunctionValueSelect(props.name, props.value, [...arrayValues], domain, props.onInputChange, props.disabled)}
                </td>
            </tr>
                    )}
        </tbody>
        );

    return (
        <Table bordered responsive>
            <thead>
            <tr>
            <th colSpan={domain.length+1} style={{textAlign:"center",padding:"0.4em",fontSize:"1.2em"}}>{props.name}</th>
            </tr>
            </thead>
            {element}
        </Table>
    );
}
export default DatabaseFunction;