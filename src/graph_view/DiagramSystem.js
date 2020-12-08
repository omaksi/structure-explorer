import {Col, Row} from "react-bootstrap";
import React from "react";
import ExpressionsContainer from "../redux/containers/ExpressionsContainer";
import DiagramModelContainer from "../redux/containers/DiagramModelContainer";

export class DiagramSystem extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){
        return(
            <div>
                <Row className='reactDiagram'>
                    <Col sm={12} >
                        <DiagramModelContainer store={this.props.store}/>
                    </Col>
                </Row>
                <Row>
                    <Col sm={12}>
                        <ExpressionsContainer diagramModel={this.props.diagramModel}/>
                    </Col>
                </Row>
            </div>
        )
    }
}
