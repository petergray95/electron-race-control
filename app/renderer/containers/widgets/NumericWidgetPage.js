import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import NumericWidget from '../../components/widgets/NumericWidget';
import * as DataActions from '../../../../shared/actions/data';

function mapStateToProps(state, props) {
  return {
    data: state.data,
    channel: props.channel
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(DataActions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NumericWidget);
