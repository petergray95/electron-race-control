import React from 'react'
import PropTypes from "prop-types";
import { Header, Input, Modal, Form } from 'semantic-ui-react'

const WidgetSettingsModal = (props) => {
  const { isOpen, handleSettingsToggle } = props;
  const channel = '49';
  return (
    <Modal open={isOpen} basic size='small' closeIcon onClose={handleSettingsToggle}>
      <Header icon='settings' content='Widget Settings' />
      <Modal.Content>
        <Form inverted>
          <Form.Input fluid label="Channel" defaultValue={channel}/>
        </Form>
        <Input placeholder={channel} />
      </Modal.Content>
    </Modal>
  )
};

WidgetSettingsModal.propTypes = {
  isOpen: PropTypes.func.isRequired,
  handleSettingsToggle: PropTypes.func.isRequired
};

export default WidgetSettingsModal
