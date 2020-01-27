import {setDiagramModel} from "../actions/index";
import {connect} from 'react-redux';
import {BodyWidget} from "../diagram/components/BodyWidget";

const mapStateToProps = (state,ownProps) => ({
  diagramModel: state.diagramModel
});

const mapDispatchOnProps = {
  setDiagramModel:setDiagramModel
};

const DiagramModelContainer = connect(
   mapStateToProps,
   mapDispatchOnProps
)(BodyWidget);

export default DiagramModelContainer;