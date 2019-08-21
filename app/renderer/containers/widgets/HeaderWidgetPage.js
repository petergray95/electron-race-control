import { connect } from 'react-redux';
import { getSessions } from '../../../../shared/reducers/sessions';
import HeaderWidget from '../../components/widgets/HeaderWidget';

function mapStateToProps(state, props) {
  return {
    ...props,
    sessions: getSessions(state)
  };
}

export default connect(mapStateToProps)(HeaderWidget);
