import React from 'react';
import {Table} from 'react-bootstrap';

/*function renderPredicateValueSelect(predicateName, predicateValues, params, domain, onChange, disabled) {
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
}*/

/*onChange={(e) => props.onInputChange([item], props.name, )}*/

//onChange={(e) => onChange(params.concat([e.target.value]), functionName)}

function DatabasePredicate(props) {
    let domain = [...props.domain];

        let element = (predicateArrayElements) => (
        <tbody>
        {predicateArrayElements.map((onePredicateArray) =>
        <tr>
            {onePredicateArray.map((domainElement) =>
                <td>
                    <select onChange={(e) => props.onInputChange(onePredicateArray.concat([e.target.value]), props.name)} value={domainElement}>
                        <option value=''>{''}</option>
                        {domain.map(item =>
                            <option disabled={props.disabled} value={item}>{item}</option>
                        )}
                    </select>
                </td>
            )}
        </tr>
        )}
        {newSelectionElement()}
        </tbody>
    );

        //ak je props.arity string tak to nevytvori pole danej velkost, teda to treba najprv parsnut
    let newSelectionElement = () => (
        <tr>
            {[...Array(parseInt(props.arity))].map((index)=>
                <td>
            <select onChange={(e) => props.onInputChange([...Array(parseInt(props.arity))], props.name)}  value={''}>
                <option value=''>{''}</option>
                {domain.map(item =>
                    <option disabled={props.disabled} value={item}>{item}</option>
                )}
            </select>
                </td>
            )}
        </tr>
    );


        let elementHead = () => (
            <thead>
            <tr>
            <th colSpan={props.arity} style={{textAlign:'center'}}>{props.name}</th>
            </tr>
            </thead>
        );



    if(Array.isArray(props.value)) {
        return (
            <Table bordered responsive>
                {elementHead()}
                {element(props.value)}
            </Table>
        );
   }
    else{
        return (
            <Table bordered responsive>
                {elementHead()}
                <tbody>
                {newSelectionElement()}
                </tbody>
            </Table>
        )
    }
}
export default DatabasePredicate;