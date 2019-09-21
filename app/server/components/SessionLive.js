// @flow
import React, { Component } from 'react';
import { Header, Form, Message, Segment, Button } from 'semantic-ui-react';
import { CirclePicker } from 'react-color';
import { ipcRenderer } from 'electron-better-ipc';
import ipcConstants from '../../../shared/constants/ipc-channels';

import styles from './Session.css';

type Props = {
  session: object,
  laps: object
};

export default class SessionLive extends Component<Props> {
  props: Props;

  isSessionConfigValid() {
    const { session } = this.props;

    if (session.name.length === 0) {
      return false;
    }

    return true;
  }

  handleColorChange(data) {
    const { session } = this.props;

    ipcRenderer.send(ipcConstants.COMMAND, {
      command: 'server:set_session_color',
      sessionId: session.sessionId,
      color: data.hex
    });
  }

  render() {
    const { session, laps } = this.props;

    return (
      <div className={styles.container}>
        <Form
          error={!this.isSessionConfigValid()}
          inverted
          onSubmit={this.handleSubmit}
        >
          <Header as="h1" inverted>
            Data Server [{session.sessionType.toUpperCase()}]
          </Header>
          <Header as="h3" inverted>
            Configuration
          </Header>
          <Message
            error
            header="Invalid configuration"
            content="Session name can not be empty"
          />
          <Form.Group widths="equal" inline>
            <Form.Input
              fluid
              required
              onChange={(event, data) => {
                ipcRenderer.send(ipcConstants.COMMAND, {
                  command: 'server:set_session_name',
                  sessionId: session.sessionId,
                  name: data.value
                });
              }}
              label="Name"
              value={session.name}
            />
            <Form.Input
              fluid
              disabled
              label="Type"
              value={session.sessionType.toUpperCase()}
            />
            <Form.Input fluid disabled label="ID" value={session.sessionId} />
          </Form.Group>
          <CirclePicker
            color={session.color}
            onChangeComplete={this.handleColorChange}
          />
        </Form>

        <Segment inverted>
          <Button
            inverted
            labelPosition="left"
            color="green"
            icon="play"
            content="Start"
            onClick={() => {
              ipcRenderer.send(ipcConstants.COMMAND, {
                command: 'server:start',
                sessionId: session.sessionId
              });
            }}
          />
          <Button
            inverted
            labelPosition="left"
            color="red"
            icon="stop"
            content="Stop"
            onClick={() => {
              ipcRenderer.send(ipcConstants.COMMAND, {
                command: 'server:stop',
                sessionId: session.sessionId
              });
            }}
          />
          <Button
            inverted
            labelPosition="left"
            color="orange"
            content="Remove Session"
            icon="trash"
            onClick={() => {
              ipcRenderer.send(ipcConstants.COMMAND, {
                command: 'server:remove',
                sessionId: session.sessionId
              });
            }}
          />
          <Button
            inverted
            labelPosition="left"
            color="blue"
            content="Export Session"
            icon="download"
            onClick={() => {
              ipcRenderer.send(ipcConstants.COMMAND, {
                command: 'server:download',
                sessionId: session.sessionId
              });
            }}
          />
        </Segment>

        <Segment inverted>
          <Header as="h3" inverted>
            Laps: {laps}
          </Header>
        </Segment>
      </div>
    );
  }
}
