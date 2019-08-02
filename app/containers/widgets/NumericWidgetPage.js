import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import NumericWidget from '../../components/widgets/NumericWidget';
import * as DashActions from '../../actions/dash';

function mapStateToProps(state) {
  return {
    message: state.dash
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(DashActions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NumericWidget);
