import React from "react";
import MessageBubble from "./MessageBubble";
import Container from "./Container";
import MessageAreaContainer from "./MessageAreaContainer";
import {Form, Button, DropdownButton, ButtonGroup, Dropdown} from "react-bootstrap";
import ExistentialQuant from "../model/formula/Formula.ExistentialQuant";

export class HenkinHintikkaGame extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){
        return(
            <Container>
                <MessageAreaContainer>
                        {this.props.formula.gameHistory.map(message =>
                            <MessageBubble>
                                {message.gameValue.generateMessage(message.gameCommitment, this.props.structureObject)}
                            </MessageBubble>
                        )}
                        <MessageBubble>
                            {this.props.formula.gameValue.generateMessage(this.props.formula.gameCommitment, this.props.structureObject)}
                        </MessageBubble>
                </MessageAreaContainer>
                {this.getChoice()}
            </Container>
        )
    }

    chooseCommitment() {
        return (
            <Form.Group>
                <Button variant="primary" onClick={() => this.props.setGameCommitment(this.props.index, true)}>Splnitelna</Button>
                <Button variant="primary" onClick={() => this.props.setGameCommitment(this.props.index,false)}>Nesplnitelna</Button>
            </Form.Group>
        );
    }

    chooseDomainValue(){
        return (
            <Form.Group>
                <DropdownButton alignRight as={ButtonGroup} title="Vyber prvok z domeny">
                    {this.props.domain.map((value, index) =>
                        <Dropdown.Item eventKey={index} onClick={() => this.props.setGameDomainChoice(this.props.index, value)}>{value}</Dropdown.Item>
                    )}
                </DropdownButton>
            </Form.Group>
        );
    }

    chooseOk(){
        return (
            <Form.Group>
                <Button variant="primary" onClick={() => this.props.continueGame(this.props.index)}>OK</Button>
            </Form.Group>
        );
    }

    getChoice(){
        if(this.props.formula.gameCommitment === null){
            return this.chooseCommitment();
        } else if(this.props.formula.gameValue instanceof ExistentialQuant){
            return this.chooseDomainValue();
        } else {
            return this.chooseOk();
        }
    }

}