import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Sessions from '../components/Sessions';
import * as SessionActions from '../../../shared/actions/sessions';

function mapStateToProps(state) {
  return {
    sessions: state.sessions
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(SessionActions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sessions);
