// @flow
import React from 'react';
import PropTypes from "prop-types";
import { Dropdown } from 'semantic-ui-react';
import Flexbox from 'flexbox-react';

import styles from './HeaderWidget.css';

const HeaderWidget = (props) => {
  const { sessions, title, activeSessionId, handleActiveSessionChange, onClose } = props;
  const options = [];

  Object.keys(sessions).forEach(sessionId => {
    const session = sessions[sessionId];

    const row = {
      key: session.sessionId,
      text: session.sessionId,
      value: session.sessionId
    };

    options.push(row);
  });

  return (
    <Flexbox
      flexDirection="row"
      minWidth="100%"
      justifyContent="space-between"
      className={styles.title}
    >
      <Flexbox>{title}</Flexbox>
      <Flexbox>
        <Dropdown
          inline
          options={options}
          value={activeSessionId}
          onChange={handleActiveSessionChange}
        />
      </Flexbox>
      <Flexbox
        role="button"
        onClick={onClose}
        onKeyPress={() => {}}
        tabIndex={0}
      >
        X
      </Flexbox>
    </Flexbox>
  );
};

HeaderWidget.propTypes = {
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  handleActiveSessionChange: PropTypes.func.isRequired,
  sessions: PropTypes.object.isRequired,
  activeSessionId: PropTypes.string.isRequired
};

export default HeaderWidget;
