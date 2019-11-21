import React from "react";
import {InputGroup} from "react-bootstrap";

function DatabaseTable({structure,setConstantValue,structureObject}){
    return(
        <table>
            <tr>
                <th></th>
                <th>1</th>
                <th>2</th>
                <th>3</th>
                <th>4</th>
                <th>5</th>
                <th>6</th>
                {Object.keys(structure.constants).map((constant) =>
                    <select value={structure.constants[constant].value}
                            id={'constant-' + constant}
                            className='form-control bootstrap-select'
                            onChange={(e) => setConstantValue(e.target.value, constant)}
                            disabled={structure.constants[constant].locked}>
                        <option value={''}>Vyber hodnotu ...</option>
                        {[...structureObject.domain].map((item) =>
                            <option value={item}>{item}</option>
                        )}
                    </select>)}
            </tr>

            <tr>
                <th>1</th>
                <td>1.1</td>
                <td>1.2</td>
                <td>1.3</td>
                <td>1.4</td>
                <td>1.5</td>
                <td>1.6</td>
            </tr>

            <tr>
                <th>2</th>
            </tr>

            <tr>
                <th>3</th>
            </tr>

            <tr>
                <th>4</th>
            </tr>

            <tr>
                <th>5</th>
            </tr>

            <tr>
                <th>6</th>
            </tr>




            )}
        </table>
    )


}

export default DatabaseTable;