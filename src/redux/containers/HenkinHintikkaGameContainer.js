import HenkinHintikkaGame from '../../expressions_view/HenkinHintikkaGame'
import {connect} from "react-redux";

const mapStateToProps = (state,props) => ({

});

const mapDispatchToProps = {

};

const HenkinHintikkaGameContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(HenkinHintikkaGame);

export default HenkinHintikkaGameContainer;