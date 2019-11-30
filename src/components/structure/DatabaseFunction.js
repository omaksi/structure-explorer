import React from 'react';
import {Table} from 'react-bootstrap';

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


function permutateWithRepetitions(permutationOptions,permutationLength) {
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
    let domainValueArray = Object.values(domain);

    let mainElement = (
        <tbody>
        {permutateWithRepetitions(domainValueArray,props.arity).map((arrayValues) =>
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

    let headElements = (
        <th style={{textAlign:"center",padding:"0.4em",fontSize:"1.2em"}}>
            {props.symbol+"("}
        {[...Array(props.arity-1)].map((x, count) =>
            <span><var>{"m"}</var><sub>{count+1}</sub>{", "}</span>
         )}
            <span><var>{"m"}</var><sub>{props.arity}</sub></span>
            {")"}
        </th>
    );

    return (
        <Table bordered responsive>
            <thead>
            <tr>
                {[...Array(props.arity)].map((x, count) =>
                    <th style={{textAlign:"center",padding:"0.4em",fontSize:"1.2em"}}><var>{"m"}</var><sub>{count+1}</sub></th>
                )}
                {headElements}
            </tr>
            </thead>
            {mainElement}
        </Table>
    );
}
export default DatabaseFunction;