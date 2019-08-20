// @flow
import { connect } from 'react-redux';
import Sessions from '../components/Sessions';
import { getSessionIds } from '../../../shared/reducers/sessions';

function mapStateToProps(state) {
  return {
    sessionIds: getSessionIds(state)
  };
}

export default connect(mapStateToProps)(Sessions);
