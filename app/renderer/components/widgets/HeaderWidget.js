// @flow
import React from 'react';
import PropTypes from "prop-types";
import Moment from 'react-moment';

const HeaderWidget = (props) => {
  const { timestamp } = props;

  const timestampValid = timestamp > 0;

  return (
    <div>
      { timestampValid ? (<Moment unix format='HH:mm:ss.SSS'>{timestamp/1000}</Moment>) : null}
    </div>
  )
};

HeaderWidget.propTypes = {
  timestamp: PropTypes.number.isRequired,
};

export default HeaderWidget;
