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
        let randomNumbers = [this.getRandom(2), this.getRandom(this.props.structureObject.domain.size)]
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
                    {this.generateMessage(this.props.formula.gameValue, this.props.formula.gameCommitment,
                                this.props.structureObject, this.props.formula.gameVariables, randomNumbers).map(message => <GameMessageBubble>{message}</GameMessageBubble>)}
                </MessageAreaContainer>
                <Form.Group>
                    {this.getChoice(this.props.formula.gameValue, this.props.formula.gameCommitment, randomNumbers)}
                </Form.Group>
                {this.toggleVariables()}
            </Container>
        );
    }

    toggleVariables(){
        if(this.props.formula.showVariables) {
            if(this.props.formula.gameVariables.size == 0){
                return (
                    <p><var>e</var> = &#123;&#160;&#125;</p>
                );
            } else {
                return (
                    <p><var>e</var> = &#123; {Array.from(this.props.formula.gameVariables).map(([key, value]) => key + ' ↦ ' + value).join(', ')} &#125;</p>
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

    chooseFormula(leftCommitment, rightCommitment, messages) {
        let leftStringCommitment = this.getCommitmentText(leftCommitment);
        let rightStringCommitment = this.getCommitmentText(rightCommitment);
        let leftUserMessage = [this.props.formula.gameValue.subLeft.toString() + ' je ' + leftStringCommitment];
        let rightUserMessage = [this.props.formula.gameValue.subRight.toString() + ' je ' + rightStringCommitment];
        return (
            <div className={"d-flex justify-content-center"}>
                <Button size='sm' variant="outline-primary" className={"rounded mr-3"} onClick={() => this.props.setGameNextFormula(this.props.index, this.props.formula.gameValue.subLeft, leftCommitment, messages, leftUserMessage)}>
                    {leftUserMessage}
                </Button>
                <Button size='sm' variant="outline-primary" className={"rounded mr-3"} onClick={() => this.props.setGameNextFormula(this.props.index, this.props.formula.gameValue.subRight, rightCommitment, messages, rightUserMessage)}>
                    {rightUserMessage}
                </Button>
                {this.writeVariables()}
            </div>
        );
    }

    chooseDomainValue(messages){
        let varName = 'n' + this.props.formula.gameVariables.size;
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

    chooseOk(messages, randomNumbers){
        return (
            <div className={"d-flex justify-content-center"}>
                <Button size='sm' variant="outline-primary" className={"rounded mr-3"} onClick={() => this.props.continueGame(this.props.index, messages, ['Pokračuj'], randomNumbers)}>Pokračuj</Button>
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

    getChoice(gameValue, gameCommitment, randomNumbers){
        let messages = this.generateMessage(gameValue, gameCommitment, this.props.structureObject, this.props.formula.gameVariables, randomNumbers);
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
                case PLAYER_EQUIVALENCE:
                    return this.chooseImplication(messages, gameValue, gameCommitment);
                case NEGATION:
                case GAME_OPERATOR:
                case GAME_QUANTIFIER:
                case GAME_IMPLICATION:
                case GAME_EQUIVALENCE:
                    return this.chooseOk(messages, randomNumbers);
            }
        }
    }

    generateMessage(gameValue, gameCommitment, structure, variables, randomNumbers){
        let form;
        let varName = 'n' + variables.size;
        let messages = [];
        if(gameCommitment === null){
            messages.push(FIRST_QUESTION(gameValue.toString()))
            return messages;
        } else {
            let truthValue = this.getCommitmentText(gameCommitment);
            let oppositeTruthValue = this.getCommitmentText(!gameCommitment);
            let subFormulas = gameValue.getSubFormulas();
            messages.push(ENTRY_SENTENCE(gameValue.toString(), truthValue));
            switch(gameValue.getType(gameCommitment)){
                case ATOM:
                    const initial = this.props.formula.gameHistory[0];
                    if(gameCommitment === gameValue.eval(structure, variables)){
                        messages.push('Vyhral/a si! ' + gameValue.toString() + ' je naozaj ' + truthValue
                            + ', pretože ' + this.getWinningEvaluatedFormula(gameValue, structure, variables, gameCommitment));
                        messages.push(`Tvoj úvodný predpoklad,
                            že formula ${initial.gameValue}
                            je ${this.getCommitmentText(initial.gameCommitment)},
                            je správny.`)
                    } else {
                        messages.push('Prehral/a si! ' + gameValue.toString() + ' je ' + oppositeTruthValue
                            + ', pretože ' + this.getLoosingEvaluatedFormula(gameValue, structure, variables, gameCommitment));
                        if(initial.gameValue.eval(structure, initial.gameVariables) === initial.gameCommitment){
                            messages.push(`Mohol/mohla si však vyhrať.
                                Tvoj úvodný predpoklad,
                                že formula ${initial.gameValue}
                                je ${this.getCommitmentText(initial.gameCommitment)},
                                je správny.
                                Nájdi chybnú odpoveď a zmeň ju!`);
                        } else {
                            messages.push(`Tvoj úvodný predpoklad,
                                že formula ${initial.gameValue}
                                je ${this.getCommitmentText(initial.gameCommitment)},
                                je chybný.`)
                        }
                    }
                    return messages;

                case NEGATION:
                    messages.push('Potom ' + subFormulas[0].toString() + ' je ' + oppositeTruthValue);
                    return messages;

                case PLAYER_OPERATOR:
                    messages.push(`Ktorá z jej priamych podformúl je ${truthValue}?`);
                    messages.push('1. ' + subFormulas[0].toString());
                    messages.push('2. ' + subFormulas[1].toString());
                    return messages;

                case GAME_OPERATOR:
                    form = subFormulas[randomNumbers[0]].toString();
                    if(subFormulas[0].eval(structure, variables) !== gameCommitment){
                        form = subFormulas[0].toString();
                    } else if(subFormulas[1].eval(structure, variables) !== gameCommitment){
                        form = subFormulas[1].toString();
                    }
                    messages.push(`Potom ${form} je ${truthValue}.`);
                    return messages;

                case PLAYER_QUANTIFIER:
                    form = subFormulas[0].createCopy();
                    form.setVariable(gameValue.variableName, varName);
                    messages.push(`Ktorý prvok z domény má premenná ${varName} označovať, aby bola formula ${form} ${truthValue}?`);
                    return messages;

                case GAME_QUANTIFIER:
                    let gameValueWithVariable = subFormulas[0].createCopy();
                    gameValueWithVariable.setVariable(gameValue.variableName, varName);
                    messages.push(`Potom je ${truthValue} aj formula ${gameValueWithVariable.toString()},`);
                    let eCopy = new Map(variables);
                    for (let item of structure.domain) {
                        eCopy.set(gameValue.variableName, item);
                        if (subFormulas[0].eval(structure, eCopy) !== gameCommitment) {
                            messages.push(`keď premennou ${varName} označíme prvok ${item}.`);
                            return messages;
                        }
                    }
                    messages.push(`keď premennou ${varName} označíme prvok ${Array.from(structure.domain)[randomNumbers[1]]}.`);
                    return messages;

                case PLAYER_IMPLICATION:
                    messages.push('Ktorý z nasledujúcich prípadov nastáva?');
                    messages.push(`1. Podformula ${subFormulas[0].toString()} je ${oppositeTruthValue}.`);
                    messages.push(`2. Podformula ${subFormulas[1].toString()} je ${truthValue}.`);
                    return messages;

                case GAME_IMPLICATION:
                    let formValue;
                    if(subFormulas[0].eval(structure, variables) === gameCommitment){
                        form = subFormulas[0];
                        formValue = oppositeTruthValue;
                    } else if(subFormulas[1].eval(structure, variables) !== gameCommitment){
                        form = subFormulas[1];
                        formValue = truthValue;
                    } else if (!randomNumbers[0]) {
                        form = subFormulas[0];
                        formValue = oppositeTruthValue;
                    } else {
                        form = subFormulas[1];
                        formValue = truthValue;
                    }
                    messages.push(`Potom ${form.toString()} je ${formValue}.`);
                    return messages;

                case PLAYER_EQUIVALENCE:
                    {
                        const ltr = new Implication(subFormulas[0], subFormulas[1]);
                        const rtl = new Implication(subFormulas[1], subFormulas[0]);
                        messages.push(`Ktorá z nasledujúcich formúl je potom ${truthValue}?`);
                        messages.push(`1. Formula ${ltr.toString()}.`);
                        messages.push(`2. Formula ${rtl.toString()}.`);
                        return messages;
                    }

                case GAME_EQUIVALENCE:
                    {
                        const ltr = new Implication(subFormulas[0], subFormulas[1]);
                        const rtl = new Implication(subFormulas[1], subFormulas[0]);
                        let form;
                        if(ltr.eval(structure, variables) !== gameCommitment) {
                            form = ltr;
                        } else if(rtl.eval(structure, variables) !== gameCommitment) {
                            form = rtl;
                        } else if (!randomNumbers[0]) {
                            form = ltr;
                        } else {
                            form = rtl;
                        }
                        messages.push(`Potom ${form} je ${truthValue}.`);
                        return messages;
                    }
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