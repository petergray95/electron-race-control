import { connect } from 'react-redux';
import HeaderWidget from '../../components/widgets/HeaderWidget';

function mapStateToProps(state, props) {
  return {
    ...props
  };
}

export default connect(mapStateToProps)(HeaderWidget);
