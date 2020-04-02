import React from 'react';

export class SelectComponent extends React.Component{
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.setState({value: e.target.value});
        addIntoFunctionTable(this.props.index,e.target.value,this.props.props);
    }

    render() {
        return(
            <td>
                {<select className="selectComponent" onChange={(e) => this.handleChange(e)}  value={this.props.props.selectionElement[this.props.index]}>
                    <option value=''>{''}</option>
                    {this.props.domain.map(item =>
                        <option key={item} disabled={this.props.props.disabled} value={item}>{item}</option>
                    )}
                </select>}
            </td>
        )
    }
}

function addIntoFunctionTable(index,value,props){
    props.selectionElement[index]=value;

    for(let i = 0;i<props.selectionElement.length;i++){
        if(!props.selectionElement[i].length>0){
            return;
        }
    }
    let array = props.selectionElement.slice();
    props.onInputChange(array,props.name,true);
    props.selectionElement.fill("");
}

