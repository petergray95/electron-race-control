// @flow
import { connect } from 'react-redux';
import { getSessions } from '../../../../shared/reducers/sessions';
import BaseWidget from '../../components/widgets/BaseWidget';

function mapStateToProps(state, props) {
  return {
    ...props,
    sessions: getSessions(state)
  };
}

export default connect(mapStateToProps)(BaseWidget);
