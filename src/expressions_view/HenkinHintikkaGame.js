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
import {FIRST_QUESTION} from "../constants/messages";

export class HenkinHintikkaGame extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){
        return(
            <Container>
                <MessageAreaContainer>
                        {this.props.formula.gameHistory.map((message, index) =>
                            <MessageBubble onClick={() => this.props.goBack(this.props.index, index)}>
                                {this.generateMessage(message.gameValue, message.gameCommitment, this.props.structureObject, message.gameVariables)}
                            </MessageBubble>
                        )}
                        <MessageBubble>
                            {this.generateMessage(this.props.formula.gameValue, this.props.formula.gameCommitment, this.props.structureObject, this.props.formula.gameVariables)}
                        </MessageBubble>
                </MessageAreaContainer>
                {this.getChoice(this.props.formula.gameValue, this.props.formula.gameCommitment)}
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

    chooseFormula(leftCommitment, rightCommitment) {
        return (
            <Form.Group>
                <Button variant="primary" onClick={() => this.props.setGameNextFormula(this.props.index, this.props.formula.gameValue.subLeft, leftCommitment)}>
                    {this.props.formula.gameValue.subLeft.toString()}
                </Button>
                <Button variant="primary" onClick={() => this.props.setGameNextFormula(this.props.index, this.props.formula.gameValue.subRight, rightCommitment)}>
                    {this.props.formula.gameValue.subRight.toString()}
                </Button>
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

    chooseEndGame(){
        return (
            <Form.Group>
                <Button variant="primary" onClick={() => this.props.endGame(this.props.index)}>Ukoncit hru</Button>
            </Form.Group>
        );
    }

    getChoice(gameValue, gameCommitment){
        if(gameCommitment === null){
            return this.chooseCommitment();
        } else {
            switch(gameValue.getType(gameCommitment)){
                case ATOM:
                    return this.chooseEndGame();
                case PLAYER_OPERATOR:
                    return this.chooseFormula(gameCommitment, gameCommitment);
                case PLAYER_IMPLICATION:
                    return this.chooseFormula(!gameCommitment, gameCommitment);
                case PLAYER_QUANTIFIER:
                    return this.chooseDomainValue();
                case NEGATION:
                case GAME_OPERATOR:
                case GAME_QUANTIFIER:
                case GAME_IMPLICATION:
                    return this.chooseOk();
            }
        }
    }

    generateMessage(gameValue, gameCommitment, structure, variables){
        let leftEval;
        let form;
        if(gameCommitment === null){
            return FIRST_QUESTION(gameValue.toString());
        } else {
            let truthValue = gameCommitment ? 'splnitelna' : 'nesplnitelna';
            let oppositeTruthValue = gameCommitment ? 'nesplnitelna' : 'splnitelna';
            let subFormulas = gameValue.getSubFormulas();
            switch(gameValue.getType(gameCommitment)){
                case ATOM:
                    let resolution = gameCommitment === gameValue.eval(structure, variables)
                        ? 'Vyhral si, pretoze ' + gameValue.toString() + ' je ' + truthValue
                        : 'Prehral si, pretoze ' + gameValue.toString() + ' je ' + oppositeTruthValue;
                    return 'Ak predpokladaš, že ' + gameValue.toString() + ' je ' + truthValue + '. ' + resolution;

                case NEGATION:
                    return 'Ak predpokladaš, že ' + gameValue.toString() + ' je ' + truthValue + ', tak potom '
                        + subFormulas[0].toString() + ' je ' + oppositeTruthValue;

                case PLAYER_OPERATOR:
                    return 'Ak predpokladaš že formula ' + gameValue.toString() + ' je ' + truthValue + ', tak potom: ' + subFormulas[0].toString()
                        + ' alebo ' + subFormulas[1] + ' je ' + truthValue;

                case GAME_OPERATOR:
                    leftEval = subFormulas[0].eval(structure, variables);
                    form = leftEval !== gameCommitment ? subFormulas[0].toString() : subFormulas[1].toString();
                    return 'Ak predpokladaš že formula ' + gameValue.toString() + ' je ' + truthValue + ', tak potom: '
                        + form + ' je ' + oppositeTruthValue;

                case PLAYER_QUANTIFIER:
                    return 'Pre ktorý prvok z domény predpokladaš, že formula ' + gameValue.toString() + " je " + truthValue;

                case GAME_QUANTIFIER:
                    let eCopy = new Map(variables);
                    for (let item of structure.domain) {
                        eCopy.set(gameValue.variableName, item);
                        if (subFormulas[0].eval(structure, eCopy) !== gameCommitment) {
                            return 'Ak predpokladaš, že ' + gameValue.toString() + ' je ' + truthValue + ', tak potom aj ...';
                        }
                    }
                    return 'Ak predpokladaš, že ' + gameValue.toString() + ' je ' + truthValue + ', tak potom aj ...';

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