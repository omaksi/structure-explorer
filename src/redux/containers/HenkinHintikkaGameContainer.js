import {HenkinHintikkaGame} from '../../expressions_view/HenkinHintikkaGame'
import {connect} from "react-redux";
import {
    continueGame,
    endGame,
    getVariables,
    goBack,
    setGameCommitment,
    setGameDomainChoice,
    setGameNextFormula
} from "../actions";
import {getStructureObject} from "../selectors/structureObject";

const mapStateToProps = (state,props) => ({
    structureObject: getStructureObject(state)
});

const mapDispatchToProps = {
    setGameCommitment: setGameCommitment,
    setGameDomainChoice: setGameDomainChoice,
    continueGame: continueGame,
    endGame: endGame,
    setGameNextFormula: setGameNextFormula,
    goBack: goBack,
    getVariables: getVariables
};

const HenkinHintikkaGameContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(HenkinHintikkaGame);

export default HenkinHintikkaGameContainer;