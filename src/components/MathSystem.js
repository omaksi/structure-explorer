import {PREDICATE} from "../constants";
import {Col, Row, Table} from "react-bootstrap";
import React from "react";
import LanguageContainer from "../containers/LanguageContainer";
import VariablesValueContainer from "../containers/VariablesValueContainer";
import StructureContainer from "../containers/StructureContainer";

export class MathSystem extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.syncMathState();
    }

    render(){
        return(
            <Row>
                <Col sm={6}>
                    <LanguageContainer/>
                    <VariablesValueContainer/>
                </Col>
                <Col sm={6}>
                    <StructureContainer/>
                </Col>
            </Row>
        )
    }
}
