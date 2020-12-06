import {connect} from "react-redux";
import {MathSystem} from "../../math_view/MathSystem";
import {syncMathState} from "../actions";

const mapStateToProps = (state,myprops) => ({
    diagramModel:myprops.diagramModel
});

const mapDispatchOnProps = {
    syncMathState:syncMathState
};

const MathSystemContainer = connect(
    mapStateToProps,
    mapDispatchOnProps
)(MathSystem);

export default MathSystemContainer;