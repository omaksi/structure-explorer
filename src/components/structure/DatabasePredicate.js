import React from 'react';
import {Table} from 'react-bootstrap';

function renderPredicateValueSelect(predicateName, predicateValues, params, domain, onChange, disabled,value,index) {
    return (
        <select onChange={(e) => changeValue(onChange,e.target.value,params,index,predicateName)} value={value}>
            <option value=''>{''}</option>
            {domain.map(item =>
                <option disabled={disabled} value={item}>{item}</option>
            )}
        </select>
    )
}
function changeValue(func,value,params,index,predicateName){
    if(value===params[index]){
        return;
    }
    func(params,predicateName,false);
    if(value!==''){
        params[index]=value;
        func(params,predicateName,true);
    }
}

function addIntoFunctionTable(index,value,props){
    console.log("val",value,"index",index);
    props.selectionElement[index]=value;

    console.log(props.selectionElement);

    for(let i = 0;i<props.selectionElement.length;i++){
        if(props.selectionElement[i]===""){
            return;
        }
    }
    let array = props.selectionElement.slice();
    props.onInputChange(array,props.name,true);
    props.selectionElement.fill("");
}

function DatabasePredicate(props) {
    let domain = [...props.domain];
    if(props.selectionElement===undefined){
        props = Object.assign({selectionElement: Array(parseInt(props.arity))}, props);
        props.selectionElement.fill("");
    }

        let element = (predicateArrayElements) => (
        <tbody>
        {predicateArrayElements.map((onePredicateArray) =>
        <tr>
            {onePredicateArray.map((domainElement,index) =>
                <td>
                    {renderPredicateValueSelect(props.name, props.value, [...onePredicateArray], domain, props.onInputChange, props.disabled,domainElement,index)}

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
            {[...Array(parseInt(props.arity))].map((value,index)=>
                <td>
            <select onChange={(e) => addIntoFunctionTable(index,e.target.value,props)}  value={props.selectionElement[index]}>
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