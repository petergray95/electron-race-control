// @flow
import React from 'react';
import PropTypes from "prop-types";
import Moment from 'react-moment';
import Flexbox from 'flexbox-react';

const HeaderWidget = (props) => {
  const { timestamp } = props;

  const timestampValid = timestamp > 0;

  return (
    <Flexbox
      flexDirection="row"
      minWidth="100%"
      justifyContent="space-between"
    >
      <Flexbox>
        { timestampValid ? (<Moment unix format='HH:mm:ss.SSS'>{timestamp/1000}</Moment>) : null}
      </Flexbox>
    </Flexbox>
  )
};

HeaderWidget.propTypes = {
  timestamp: PropTypes.number.isRequired
};

export default HeaderWidget;
