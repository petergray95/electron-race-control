// @flow
import { connect } from 'react-redux';
import Sessions from '../components/Sessions';
import { getSessions } from '../../../shared/reducers/sessions';

function mapStateToProps(state) {
  return {
    sessions: getSessions(state)
  };
}

export default connect(mapStateToProps)(Sessions);
