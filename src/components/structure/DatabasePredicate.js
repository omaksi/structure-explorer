import React from 'react';
import {Table} from 'react-bootstrap';

function DatabasePredicate(props) {
        let element = (predicateArrayElements) => (
        <tbody>
        {predicateArrayElements.map((onePredicateArray) =>
        <tr>
            {onePredicateArray.map((domainElement) =>
                <td>
                    {domainElement}
                </td>
            )}
        </tr>
        )}
        </tbody>
    );

    /*if(Array.isArray(props.value)) {*/
        return (

            <Table bordered responsive>
                {element(props.value)}
            </Table>
        );
   /*}*/
}
export default DatabasePredicate;