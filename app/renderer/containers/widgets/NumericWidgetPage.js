import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import NumericWidget from '../../components/widgets/NumericWidget';
import * as DashActions from '../../../../shared/actions/dash';

function mapStateToProps(state, props) {
  return {
    message: state.dash,
    channel: props.channel
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(DashActions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NumericWidget);
