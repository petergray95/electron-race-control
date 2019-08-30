// @flow
import React from 'react';
import PropTypes from "prop-types";
import { Dropdown, Icon } from 'semantic-ui-react';
import Flexbox from 'flexbox-react';

import styles from './TitleBarWidget.css';

const TitleBarWidget = (props) => {
  const { sessions, title, activeSessionId, handleActiveSessionChange, onClose } = props;
  const options = [];

  Object.keys(sessions).forEach(sessionId => {
    const session = sessions[sessionId];

    const row = {
      key: session.sessionId,
      text: session.name,
      value: session.sessionId
    };

    options.push(row);
  });

  return (
    <Flexbox
      flexDirection="row"
      minWidth="100%"
      justifyContent="space-between"
      className={['titlebar', styles.titlebar].join(' ')}
    >
      <Flexbox><Icon name="square" />{title}</Flexbox>
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

TitleBarWidget.propTypes = {
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  handleActiveSessionChange: PropTypes.func.isRequired,
  sessions: PropTypes.object.isRequired,
  activeSessionId: PropTypes.string.isRequired
};

export default TitleBarWidget;
