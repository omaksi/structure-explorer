import {connect} from "react-redux";
import {MathSystem} from "../components/MathSystem";
import {syncMathState} from "../actions";

const mapStateToProps = () => ({
});

const mapDispatchOnProps = {
    syncMathState:syncMathState
};

const MathSystemContainer = connect(
    mapStateToProps,
    mapDispatchOnProps
)(MathSystem);

export default MathSystemContainer;