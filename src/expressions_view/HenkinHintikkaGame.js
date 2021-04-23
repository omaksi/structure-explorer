import React from "react";
import GameMessageBubble from "./GameMessageBubble";
import Container from "./Container";
import MessageAreaContainer from "./MessageAreaContainer";
import {Form, Button, DropdownButton, ButtonGroup, Dropdown} from "react-bootstrap";
import {
    ATOM, GAME_EQUIVALENCE, GAME_IMPLICATION,
    GAME_OPERATOR,
    GAME_QUANTIFIER,
    NEGATION, PLAYER_EQUIVALENCE, PLAYER_IMPLICATION,
    PLAYER_OPERATOR,
    PLAYER_QUANTIFIER
} from "../constants/gameConstants";
import {
    ENTRY_SENTENCE,
    EVALUATED_EQUALITY, EVALUATED_INEQUALITY,
    EVALUATED_PREDICATE_IN,
    EVALUATED_PREDICATE_NOT_IN,
    FIRST_QUESTION
} from "../constants/messages";
import {UserMessageBubble} from "./UserMessageBubble";
import PredicateAtom from "../model/formula/Formula.PredicateAtom";
import Implication from "../model/formula/Formula.Implication";

export class HenkinHintikkaGame extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){
        return(
            <Container>
                <MessageAreaContainer>
                    {this.props.formula.gameHistory.map((history, index) =>
                        history.gameMessages.map(message =>
                            <GameMessageBubble>
                                {message}
                            </GameMessageBubble>).concat(
                        history.userMessages.map(message => <UserMessageBubble onClick={() => this.props.goBack(this.props.index, index)}>{message}</UserMessageBubble>))
                    )}
                    {this.generateMessage(this.props.formula.gameHistory[this.props.formula.gameHistory.length - 1])
                                        .map(message => <GameMessageBubble>{message}</GameMessageBubble>)}
                </MessageAreaContainer>
                <Form.Group>
                    {this.getChoice(this.props.formula.gameHistory[this.props.formula.gameHistory.length - 1])}
                </Form.Group>
                {this.toggleVariables(this.props.formula.gameHistory[this.props.formula.gameHistory.length - 1])}
            </Container>
        );
    }

    toggleVariables(entry){
        if(this.props.formula.showVariables) {
            if(entry.gameVariables.size == 0){
                return (
                    <p><var>e</var> = &#123;&#160;&#125;</p>
                );
            } else {
                return (
                    <p><var>e</var> = &#123; {Array.from(entry.gameVariables).map(([key, value]) => key + ' ↦ ' + value).join(', ')} &#125;</p>
                );
            }
        } else {
            return null;
        }
    }

    writeVariables(){
        let writeOrHide = 'Zobraziť'
        if(this.props.formula.showVariables){
            writeOrHide = 'Skryť';
        }
        return(
            <Button size='sm' variant="outline-primary" className={"rounded mr-3"} onClick={() => this.props.getVariables(this.props.index)}>{writeOrHide} ohodnotenie premenných</Button>
        );
    }

    chooseCommitment(messages) {
        return (
            <div className={"d-flex justify-content-center"}>
                <Button size='sm' variant="outline-primary" className={"rounded mr-3"} onClick={() => this.props.setGameCommitment(this.props.index, true, messages, ['Pravdivá'])}>Pravdivá</Button>
                <Button size='sm' variant="outline-primary" className={"rounded mr-3"} onClick={() => this.props.setGameCommitment(this.props.index,false, messages, ['Nepravdivá'])}>Nepravdivá</Button>
            </div>
        );
    }

    chooseFormula(entry, leftCommitment, rightCommitment, messages) {
        let leftStringCommitment = this.getCommitmentText(leftCommitment);
        let rightStringCommitment = this.getCommitmentText(rightCommitment);
        let leftUserMessage = [entry.gameValue.subLeft.toString() + ' je ' + leftStringCommitment];
        let rightUserMessage = [entry.gameValue.subRight.toString() + ' je ' + rightStringCommitment];
        return (
            <div className={"d-flex justify-content-center"}>
                <Button size='sm' variant="outline-primary" className={"rounded mr-3"} onClick={() => this.props.setGameNextFormula(this.props.index, entry.gameValue.subLeft, leftCommitment, messages, leftUserMessage)}>
                    {leftUserMessage}
                </Button>
                <Button size='sm' variant="outline-primary" className={"rounded mr-3"} onClick={() => this.props.setGameNextFormula(this.props.index, entry.gameValue.subRight, rightCommitment, messages, rightUserMessage)}>
                    {rightUserMessage}
                </Button>
                {this.writeVariables()}
            </div>
        );
    }

    chooseDomainValue(entry, messages){
        let varName = 'n' + entry.gameVariables.size;
        return (
            <div className={"d-flex justify-content-center"}>
                <DropdownButton size='sm' variant="outline-primary" className={"rounded mr-3"} alignRight as={ButtonGroup} title="Vyber prvok z domény">
                    {this.props.domain.map((value, index) =>
                        <Dropdown.Item size='sm' eventKey={index} onClick={() => this.props.setGameDomainChoice(this.props.index, value, messages, [`Premenná ${varName} označuje prvok ${value}`])}>{value}</Dropdown.Item>
                    )}
                </DropdownButton>
                {this.writeVariables()}
            </div>
        );
    }

    chooseImplication(messages, gameValue, commitment){
        let leftImplication = new Implication(gameValue.subLeft, gameValue.subRight);
        let rightImplication = new Implication(gameValue.subRight, gameValue.subLeft);
        let leftUserMessage = [leftImplication.toString() + ' je ' + this.getCommitmentText(commitment)];
        let rightUserMessage = [rightImplication.toString() + ' je ' + this.getCommitmentText(commitment)];
        return (
            <div className={"d-flex justify-content-center"}>
                <Button size='sm' variant="outline-primary" className={"rounded mr-3"} onClick={() => this.props.setGameNextFormula(this.props.index, leftImplication, commitment, messages, leftUserMessage)}>
                    {leftUserMessage}
                </Button>
                <Button size='sm' variant="outline-primary" className={"rounded mr-3"} onClick={() => this.props.setGameNextFormula(this.props.index, rightImplication, commitment, messages, rightUserMessage)}>
                    {rightUserMessage}
                </Button>
                {this.writeVariables()}
            </div>
        );
    }

    chooseOk(messages){
        return (
            <div className={"d-flex justify-content-center"}>
                <Button size='sm' variant="outline-primary" className={"rounded mr-3"} onClick={() => this.props.continueGame(this.props.index, messages, ['Pokračuj'])}>Pokračuj</Button>
                {this.writeVariables()}
            </div>
        );
    }

    chooseEndGame(){
        return (
            <div className={"d-flex justify-content-center"}>
                <Button size='sm' variant="outline-primary" className={"rounded mr-3"} onClick={() => this.props.endGame(this.props.index)}>Ukončiť hru</Button>
                {this.writeVariables()}
            </div>
        );
    }

    getChoice(entry){
        let messages = this.generateMessage(entry);
        if(entry.gameCommitment === null){
            return this.chooseCommitment(messages);
        } else {
            switch(entry.gameValue.getType(entry.gameCommitment)){
                case ATOM:
                    return this.chooseEndGame();
                case PLAYER_OPERATOR:
                    return this.chooseFormula(entry, entry.gameCommitment, entry.gameCommitment, messages);
                case PLAYER_IMPLICATION:
                    return this.chooseFormula(entry, !entry.gameCommitment, entry.gameCommitment, messages);
                case PLAYER_QUANTIFIER:
                    return this.chooseDomainValue(entry, messages);
                case PLAYER_EQUIVALENCE:
                    return this.chooseImplication(messages, entry.gameValue, entry.gameCommitment);
                case NEGATION:
                case GAME_OPERATOR:
                case GAME_QUANTIFIER:
                case GAME_IMPLICATION:
                case GAME_EQUIVALENCE:
                    return this.chooseOk(messages);
            }
        }
    }

    generateMessage(entry){
        let varName = 'n' + entry.gameVariables.size;
        let messages = [];
        if(entry.gameCommitment === null){
            messages.push(FIRST_QUESTION(entry.gameValue))
            return messages;
        } else {
            const structure = this.props.structureObject;
            let subFormulas = entry.gameValue.getSubFormulas(structure, entry.gameVariables);
            messages.push(ENTRY_SENTENCE(entry.gameValue.toString(), this.getCommitmentText(entry.gameCommitment)));
            switch(entry.gameValue.getType(entry.gameCommitment)){
                case ATOM:
                    const initial = this.props.formula.gameHistory[1];
                    if(entry.gameCommitment === entry.gameValue.eval(structure, entry.gameVariables)){
                        messages.push('Vyhral/a si! ' + entry.gameValue + ' je naozaj ' + this.getCommitmentText(entry.gameCommitment)
                            + ', pretože ' + this.getWinningEvaluatedFormula(entry.gameValue, structure, entry.gameVariables, entry.gameCommitment));
                        messages.push(`Tvoj úvodný predpoklad,
                            že formula ${initial.gameValue}
                            je ${this.getCommitmentText(initial.gameCommitment)},
                            bol správny.`)
                    } else {
                        messages.push('Prehral/a si! ' + entry.gameValue + ' je ' + this.getCommitmentText(!entry.gameCommitment)
                            + ', pretože ' + this.getLoosingEvaluatedFormula(entry.gameValue, structure, entry.gameVariables, entry.gameCommitment));
                        if(initial.gameValue.eval(structure, initial.gameVariables) === initial.gameCommitment){
                            messages.push(`Mohol/mohla si však vyhrať.
                                Tvoj úvodný predpoklad,
                                že formula ${initial.gameValue}
                                je ${this.getCommitmentText(initial.gameCommitment)},
                                je správny.
                                Nájdi chybnú odpoveď a zmeň ju!`);
                        } else {
                            messages.push(`Tvoj úvodný predpoklad,
                                že formula ${initial.gameValue}
                                je ${this.getCommitmentText(initial.gameCommitment)},
                                je chybný.`)
                        }
                    }
                    return messages;

                case NEGATION:
                    messages.push('Potom ' + entry.nextValue.formula + ' je ' + this.getCommitmentText(entry.nextValue.commitment));
                    return messages;

                case PLAYER_OPERATOR:
                    messages.push(`Ktorá z jej priamych podformúl je ${this.getCommitmentText(entry.gameCommitment)}?`);
                    messages.push('1. ' + subFormulas[0].formula);
                    messages.push('2. ' + subFormulas[1].formula);
                    return messages;

                case GAME_OPERATOR:
                    messages.push(`Potom ${entry.nextValue.formula} je ${this.getCommitmentText(entry.nextValue.commitment)}.`);
                    return messages;

                case PLAYER_QUANTIFIER:
                    let form = entry.gameValue.subFormula.createCopy();
                    form.setVariable(entry.gameValue.variableName, varName);
                    messages.push(`Ktorý prvok z domény má premenná ${varName} označovať, 
                                    aby bola formula ${form} ${this.getCommitmentText(entry.gameCommitment)}?`);
                    return messages;

                case GAME_QUANTIFIER:
                    messages.push(`Potom je ${this.getCommitmentText(entry.nextValue.commitment)} aj formula ${entry.nextValue.formula},`);
                    messages.push(`keď premennou ${entry.nextValue.variables[0]} označíme prvok ${entry.nextValue.variables[1]}.`);
                    return messages;

                case PLAYER_IMPLICATION:
                    messages.push('Ktorý z nasledujúcich prípadov nastáva?');
                    messages.push(`1. Podformula ${subFormulas[0].formula} je ${this.getCommitmentText(!entry.gameCommitment)}.`);
                    messages.push(`2. Podformula ${subFormulas[1].formula} je ${this.getCommitmentText(entry.gameCommitment)}.`);
                    return messages;

                case GAME_IMPLICATION:
                    messages.push(`Potom ${entry.nextValue.formula} je ${this.getCommitmentText(entry.nextValue.commitment)}.`);
                    return messages;

                case PLAYER_EQUIVALENCE:
                    messages.push(`Ktorá z nasledujúcich formúl je potom ${this.getCommitmentText(entry.gameCommitment)}?`);
                    messages.push(`1. Formula ${subFormulas[0].formula}.`);
                    messages.push(`2. Formula ${subFormulas[1].formula}.`);
                    return messages;

                case GAME_EQUIVALENCE:
                    messages.push(`Potom ${entry.nextValue.formula} je ${this.getCommitmentText(entry.nextValue.commitment)}.`);
                    return messages;
            }
        }
    }

    getWinningEvaluatedFormula(gameValue, structure, variables, gameCommitment){
        if(gameValue instanceof PredicateAtom){
            if(gameCommitment) {
                return EVALUATED_PREDICATE_IN(this.getEvaluatedPredicateFormula(gameValue, structure, variables), gameValue.name);
            } else {
                return EVALUATED_PREDICATE_NOT_IN(this.getEvaluatedPredicateFormula(gameValue, structure, variables), gameValue.name);
            }
        } else {
            if(gameCommitment) {
                return EVALUATED_EQUALITY(gameValue.subLeft.eval(structure, variables), gameValue.subRight.eval(structure, variables));
            } else {
                return EVALUATED_INEQUALITY(gameValue.subLeft.eval(structure, variables), gameValue.subRight.eval(structure, variables));
            }
        }
    }

    getLoosingEvaluatedFormula(gameValue, structure, variables, gameCommitment){
        if(gameValue instanceof PredicateAtom){
            if(gameCommitment) {
                return EVALUATED_PREDICATE_NOT_IN(this.getEvaluatedPredicateFormula(gameValue, structure, variables), gameValue.name);
            } else {
                return EVALUATED_PREDICATE_IN(this.getEvaluatedPredicateFormula(gameValue, structure, variables), gameValue.name);
            }
        } else {
            if(gameCommitment) {
                return EVALUATED_INEQUALITY(gameValue.subLeft.eval(structure, variables), gameValue.subRight.eval(structure, variables));
            } else {
                return EVALUATED_EQUALITY(gameValue.subLeft.eval(structure, variables), gameValue.subRight.eval(structure, variables));
            }
        }
    }

    getEvaluatedPredicateFormula(gameValue, structure, variables){
        const res = gameValue.terms
            .map(term => term.eval(structure, variables))
            .join(', ');
        if (gameValue.terms.length > 1) {
            return `(${res})`;
        }
        return res;
    }

    getCommitmentText(commitment){
        return commitment ? 'pravdivá' : 'nepravdivá';
    }

    getRandom(size){
        return Math.floor(Math.random() * size);
    }
}