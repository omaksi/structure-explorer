import {Col, Row} from "react-bootstrap";
import React, {useState} from "react";
import LanguageContainer from "../redux/containers/LanguageContainer";
import VariablesValueContainer from "../redux/containers/VariablesValueContainer";
import StructureContainer from "../redux/containers/StructureContainer";
import ExpressionsContainer from "../redux/containers/ExpressionsContainer";
import SplitPane from 'react-split-pane';

export class MathSystem extends React.Component {

    state = { width: window.innerWidth };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.syncMathState();
        window.addEventListener('resize', this.updateDimensions);
    }

    updateDimensions = () => {
        this.setState({ width: window.innerWidth});
    };

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }

    render(){
        return(
            <SplitPane split={this.state.width > 990 ? 'vertical' : 'horizontal'} allowResize={false}>
                <div className="overflow-auto vh-pane-left">
                    <LanguageContainer/>
                    <StructureContainer/>
                    <VariablesValueContainer/>
                </div>
                <div className="overflow-auto vh-pane-right">
                    <ExpressionsContainer diagramModel={this.props.diagramModel}/>
                </div>
            </SplitPane>
        )
    }
}
