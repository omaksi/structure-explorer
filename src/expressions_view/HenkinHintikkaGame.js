import React from "react";
import MessageBubble from "./MessageBubble";
import Container from "./Container";
import MessageAreaContainer from "./MessageAreaContainer";
import {Form, Button, DropdownButton, ButtonGroup, Dropdown} from "react-bootstrap";
import {
    ATOM, GAME_IMPLICATION,
    GAME_OPERATOR,
    GAME_QUANTIFIER,
    NEGATION, PLAYER_IMPLICATION,
    PLAYER_OPERATOR,
    PLAYER_QUANTIFIER
} from "../constants/gameConstants";
import {ENTRY_SENTENCE, FIRST_QUESTION} from "../constants/messages";

export class HenkinHintikkaGame extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){
        return(
            <Container>
                <MessageAreaContainer>
                    {console.log(this.props.formula.gameHistory)}
                    {console.log(this.generateMessage(this.props.formula.gameValue, this.props.formula.gameCommitment,
                        this.props.structureObject, this.props.formula.gameVariables))}
                    {this.props.formula.gameHistory.map((history, index) =>
                        history.messages.map(message => <MessageBubble onClick={() => this.props.goBack(this.props.index, index)}>{message}</MessageBubble>)
                    )}
                    {this.generateMessage(this.props.formula.gameValue, this.props.formula.gameCommitment,
                                this.props.structureObject, this.props.formula.gameVariables).map(message => <MessageBubble>{message}</MessageBubble>)}
                </MessageAreaContainer>
                {this.getChoice(this.props.formula.gameValue, this.props.formula.gameCommitment)}
            </Container>
        )
    }

    chooseCommitment(messages) {
        return (
            <Form.Group>
                <Button variant="primary" onClick={() => this.props.setGameCommitment(this.props.index, true, messages)}>Pravdiva</Button>
                <Button variant="primary" onClick={() => this.props.setGameCommitment(this.props.index,false, messages)}>Nepravdiva</Button>
            </Form.Group>
        );
    }

    chooseFormula(leftCommitment, rightCommitment, messages) {
        return (
            <Form.Group>
                <Button variant="primary" onClick={() => this.props.setGameNextFormula(this.props.index, this.props.formula.gameValue.subLeft, leftCommitment, messages)}>
                    {this.props.formula.gameValue.subLeft.toString()}
                </Button>
                <Button variant="primary" onClick={() => this.props.setGameNextFormula(this.props.index, this.props.formula.gameValue.subRight, rightCommitment, messages)}>
                    {this.props.formula.gameValue.subRight.toString()}
                </Button>
            </Form.Group>
        );
    }

    chooseDomainValue(messages){
        return (
            <Form.Group>
                <DropdownButton alignRight as={ButtonGroup} title="Vyber prvok z domeny">
                    {this.props.domain.map((value, index) =>
                        <Dropdown.Item eventKey={index} onClick={() => this.props.setGameDomainChoice(this.props.index, value, messages)}>{value}</Dropdown.Item>
                    )}
                </DropdownButton>
            </Form.Group>
        );
    }

    chooseOk(messages){
        return (
            <Form.Group>
                <Button variant="primary" onClick={() => this.props.continueGame(this.props.index, messages)}>OK</Button>
            </Form.Group>
        );
    }

    chooseEndGame(){
        return (
            <Form.Group>
                <Button variant="primary" onClick={() => this.props.endGame(this.props.index)}>Ukoncit hru</Button>
            </Form.Group>
        );
    }

    getChoice(gameValue, gameCommitment){
        let messages = this.generateMessage(gameValue, gameCommitment, this.props.structureObject, this.props.formula.gameVariables);
        if(gameCommitment === null){
            return this.chooseCommitment(messages);
        } else {
            switch(gameValue.getType(gameCommitment)){
                case ATOM:
                    return this.chooseEndGame();
                case PLAYER_OPERATOR:
                    return this.chooseFormula(gameCommitment, gameCommitment, messages);
                case PLAYER_IMPLICATION:
                    return this.chooseFormula(!gameCommitment, gameCommitment, messages);
                case PLAYER_QUANTIFIER:
                    return this.chooseDomainValue(messages);
                case NEGATION:
                case GAME_OPERATOR:
                case GAME_QUANTIFIER:
                case GAME_IMPLICATION:
                    return this.chooseOk(messages);
            }
        }
    }

    generateMessage(gameValue, gameCommitment, structure, variables){
        let leftEval;
        let form;
        let messages = [];
        if(gameCommitment === null){
            messages.push(FIRST_QUESTION(gameValue.toString()))
            return messages;
        } else {
            let truthValue = gameCommitment ? 'splnitelna' : 'nesplnitelna';
            let oppositeTruthValue = gameCommitment ? 'nesplnitelna' : 'splnitelna';
            let subFormulas = gameValue.getSubFormulas();
            switch(gameValue.getType(gameCommitment)){
                case ATOM:
                    messages.push(ENTRY_SENTENCE(gameValue.toString(), truthValue));
                    if(gameCommitment === gameValue.eval(structure, variables)){
                        messages.push('Vyhral si, pretoze ' + gameValue.toString() + ' je ' + truthValue);
                    } else {
                        messages.push('Prehral si, pretoze ' + gameValue.toString() + ' je ' + oppositeTruthValue);
                    }
                    return messages;

                case NEGATION:
                    messages.push(ENTRY_SENTENCE(gameValue.toString(), truthValue));
                    messages.push('Potom ' + subFormulas[0].toString() + ' je ' + oppositeTruthValue);
                    return messages;

                case PLAYER_OPERATOR:
                    messages.push(ENTRY_SENTENCE(gameValue.toString(), truthValue));
                    messages.push('Potom je ' + truthValue + ' jedna z tychto formul:');
                    messages.push(subFormulas[0].toString());
                    messages.push(subFormulas[1].toString());
                    return messages;

                case GAME_OPERATOR:
                    messages.push(ENTRY_SENTENCE(gameValue.toString(), truthValue));
                    leftEval = subFormulas[0].eval(structure, variables);
                    form = leftEval !== gameCommitment ? subFormulas[0].toString() : subFormulas[1].toString();
                    messages.push('Potom: ' + form + ' je ' + oppositeTruthValue);
                    return messages;

                case PLAYER_QUANTIFIER:
                    messages.push('Pre ktorý prvok z domény predpokladaš, ze dana formula je ' + truthValue + ':');
                    messages.push(gameValue.toString());
                    return messages;

                case GAME_QUANTIFIER:
                    let eCopy = new Map(variables);
                    for (let item of structure.domain) {
                        eCopy.set(gameValue.variableName, item);
                        if (subFormulas[0].eval(structure, eCopy) !== gameCommitment) {
                            messages.push(ENTRY_SENTENCE(gameValue.toString(), truthValue));
                            messages.push('Potom je ' + truthValue + ' aj pre formulu:');
                            messages.push('....');
                            return messages;
                        }
                    }
                    messages.push(ENTRY_SENTENCE(gameValue.toString(), truthValue));
                    messages.push('Potom je ' + truthValue + ' aj pre formulu:');
                    messages.push('..');
                    return messages;

                case PLAYER_IMPLICATION:
                    return 'Ak predpokladaš že formula ' + gameValue.toString() + ' je ' + truthValue + ', tak potom: ' + subFormulas[0].toString()
                        + ' je ' + oppositeTruthValue + ' alebo ' + subFormulas[1] + ' je ' + truthValue;

                case GAME_IMPLICATION:
                    leftEval = subFormulas[0].eval(structure, variables);
                    form = leftEval !== gameCommitment ? subFormulas[0].toString() + ' je ' + truthValue
                                                        : subFormulas[1].toString() + ' je ' + oppositeTruthValue;
                    return 'Ak predpokladaš že formula ' + gameValue.toString() + ' je ' + truthValue + ', tak potom: ' + form;
            }
        }
    }
}