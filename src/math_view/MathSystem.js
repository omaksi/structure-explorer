import {Col, Row} from "react-bootstrap";
import React from "react";
import LanguageContainer from "../redux/containers/LanguageContainer";
import VariablesValueContainer from "../redux/containers/VariablesValueContainer";
import StructureContainer from "../redux/containers/StructureContainer";
import ExpressionsContainer from "../redux/containers/ExpressionsContainer";

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
                    <StructureContainer/>
                    <VariablesValueContainer/>
                </Col>
                <Col sm={6}>
                    <ExpressionsContainer diagramModel={this.props.diagramModel}/>
                </Col>
            </Row>
        )
    }
}
