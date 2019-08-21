// @flow
import { connect } from 'react-redux';
import BaseWidget from '../../components/widgets/BaseWidget';

function mapStateToProps(state, props) {
  return {
    onClose: props.onClose
  };
}

export default connect(mapStateToProps)(BaseWidget);
