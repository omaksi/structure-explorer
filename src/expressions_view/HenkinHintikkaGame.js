import React from "react";
import GameMessageBubble from "./GameMessageBubble";
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
import UserMessageBubble from "./UserMessageBubble";

export class HenkinHintikkaGame extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){
        return(
            <Container>
                <MessageAreaContainer>
                    {this.props.formula.gameHistory.map((history, index) =>
                        history.gameMessages.map(message => <GameMessageBubble onClick={() => this.props.goBack(this.props.index, index)}>{message}</GameMessageBubble>).concat(
                        history.userMessages.map(message => <UserMessageBubble >{message}</UserMessageBubble>))
                    )}
                    {this.generateMessage(this.props.formula.gameValue, this.props.formula.gameCommitment,
                                this.props.structureObject, this.props.formula.gameVariables).map(message => <GameMessageBubble background={'#eee'} color={'black'}>{message}</GameMessageBubble>)}
                </MessageAreaContainer>
                {this.getChoice(this.props.formula.gameValue, this.props.formula.gameCommitment)}
            </Container>
        )
    }

    chooseCommitment(messages) {
        return (
            <Form.Group>
                <Button variant="primary" onClick={() => this.props.setGameCommitment(this.props.index, true, messages, ['Pravdivá'])}>Pravdiva</Button>
                <Button variant="primary" onClick={() => this.props.setGameCommitment(this.props.index,false, messages, ['Nepravdivá'])}>Nepravdiva</Button>
            </Form.Group>
        );
    }

    chooseFormula(leftCommitment, rightCommitment, messages) {
        let leftStringCommitment = leftCommitment ? 'pravdivá' : 'nepravdivá';
        let rightStringCommitment = rightCommitment ? 'pravdivá' : 'nepravdivá';
        let leftUserMessage = [this.props.formula.gameValue.subLeft.toString() + ' je ' + leftStringCommitment];
        let rightUserMessage = [this.props.formula.gameValue.subRight.toString() + ' je ' + rightStringCommitment];
        return (
            <Form.Group>
                <Button variant="primary" onClick={() => this.props.setGameNextFormula(this.props.index, this.props.formula.gameValue.subLeft, leftCommitment, messages, leftUserMessage)}>
                    {leftUserMessage}
                </Button>
                <Button variant="primary" onClick={() => this.props.setGameNextFormula(this.props.index, this.props.formula.gameValue.subRight, rightCommitment, messages, rightUserMessage)}>
                    {rightUserMessage}
                </Button>
            </Form.Group>
        );
    }

    chooseDomainValue(messages){
        let varName = 'n' + this.props.formula.gameVariables.size;
        return (
            <Form.Group>
                <DropdownButton alignRight as={ButtonGroup} title="Vyber prvok z domény">
                    {this.props.domain.map((value, index) =>
                        <Dropdown.Item eventKey={index} onClick={() => this.props.setGameDomainChoice(this.props.index, value, messages, ['Pre ' + varName + ' = ' + value])}>{value}</Dropdown.Item>
                    )}
                </DropdownButton>
            </Form.Group>
        );
    }

    chooseOk(messages){
        return (
            <Form.Group>
                <Button variant="primary" onClick={() => this.props.continueGame(this.props.index, messages, ['Pokračuj'])}>OK</Button>
            </Form.Group>
        );
    }

    chooseEndGame(){
        return (
            <Form.Group>
                <Button variant="primary" onClick={() => this.props.endGame(this.props.index)}>Ukončiť hru</Button>
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
            let truthValue = gameCommitment ? 'pravdivá' : 'nepravdivá';
            let oppositeTruthValue = gameCommitment ? 'nepravdivá' : 'pravdivá';
            let subFormulas = gameValue.getSubFormulas();
            switch(gameValue.getType(gameCommitment)){
                case ATOM:
                    messages.push(ENTRY_SENTENCE(gameValue.toString(), truthValue));
                    if(gameCommitment === gameValue.eval(structure, variables)){
                        messages.push('Vyhral si, pretože ' + gameValue.toString() + ' je ' + truthValue);
                    } else {
                        messages.push('Prehral si, pretože ' + gameValue.toString() + ' je ' + oppositeTruthValue);
                    }
                    return messages;

                case NEGATION:
                    messages.push(ENTRY_SENTENCE(gameValue.toString(), truthValue));
                    messages.push('Potom ' + subFormulas[0].toString() + ' je ' + oppositeTruthValue);
                    return messages;

                case PLAYER_OPERATOR:
                    messages.push(ENTRY_SENTENCE(gameValue.toString(), truthValue));
                    messages.push('Potom je ' + truthValue + ' jedna z týchto formúl');
                    messages.push(subFormulas[0].toString());
                    messages.push(subFormulas[1].toString());
                    return messages;

                case GAME_OPERATOR:
                    messages.push(ENTRY_SENTENCE(gameValue.toString(), truthValue));
                    leftEval = subFormulas[0].eval(structure, variables);
                    form = leftEval !== gameCommitment ? subFormulas[0].toString() : subFormulas[1].toString();
                    messages.push('Potom ' + form + ' je ' + oppositeTruthValue);
                    return messages;

                case PLAYER_QUANTIFIER:
                    messages.push('Pre ktorý prvok z domény predpokladáš, že táto formula ');
                    messages.push(gameValue.toString() + ' je ' + truthValue);
                    return messages;

                case GAME_QUANTIFIER:
                    let varName = 'n' + variables.size;
                    let gameValueWithVariable = subFormulas[0].createCopy();
                    gameValueWithVariable.setVariable(gameValue.variableName, varName);
                    let eCopy = new Map(variables);
                    for (let item of structure.domain) {
                        eCopy.set(gameValue.variableName, item);
                        if (subFormulas[0].eval(structure, eCopy) !== gameCommitment) {
                            messages.push(ENTRY_SENTENCE(gameValue.toString(), truthValue) + '. Potom je ' + truthValue + ' aj formula');
                            messages.push(gameValueWithVariable.toString() + ', kde ' + varName + ' = ' + item);
                            return messages;
                        }
                    }
                    messages.push(ENTRY_SENTENCE(gameValue.toString(), truthValue) + '. Potom je ' + truthValue + ' aj formula');
                    messages.push(gameValueWithVariable.toString() + ', kde ' + varName + ' = ' + eCopy.get(gameValue.variableName));
                    return messages;

                case PLAYER_IMPLICATION:
                    messages.push(ENTRY_SENTENCE(gameValue.toString(), truthValue) + ' Potom pre jednu z týchto formúl platí');
                    messages.push(subFormulas[0].toString() + ' je ' + oppositeTruthValue);
                    messages.push(subFormulas[1].toString() + ' je ' + truthValue);
                    return messages;

                case GAME_IMPLICATION:
                    leftEval = subFormulas[0].eval(structure, variables);
                    form = leftEval !== gameCommitment ? subFormulas[0].toString() + ' je ' + truthValue
                                                        : subFormulas[1].toString() + ' je ' + oppositeTruthValue;
                    messages.push(ENTRY_SENTENCE(gameValue.toString(), truthValue));
                    messages.push('Potom ' + form);
                    return messages;
            }
        }
    }
}