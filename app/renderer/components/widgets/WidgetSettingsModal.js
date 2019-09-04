// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { Header, Modal, Form } from 'semantic-ui-react';

const WidgetSettingsModal = props => {
  const { isOpen, handleSettingsToggle, handleSetChannelName, channel } = props;

  return (
    <Modal
      open={isOpen}
      basic
      size="small"
      closeIcon
      onClose={handleSettingsToggle}
    >
      <Header icon="settings" content="Widget Settings" />
      <Modal.Content>
        <Form inverted>
          <Form.Input
            fluid
            label="Channel"
            value={channel}
            onChange={handleSetChannelName}
          />
        </Form>
      </Modal.Content>
    </Modal>
  );
};

WidgetSettingsModal.propTypes = {
  channel: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  handleSettingsToggle: PropTypes.func.isRequired,
  handleSetChannelName: PropTypes.func.isRequired
};

export default WidgetSettingsModal;
