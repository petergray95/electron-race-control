// @flow
import React, { Component } from 'react';
import {
  Grid,
  Header,
  Form,
  Message,
  Segment,
  Button
} from 'semantic-ui-react';
import { ipcRenderer } from 'electron-better-ipc';
import ipcConstants from '../../../shared/constants/ipc-channels';
import TimingFullPage from '../containers/TimingFullPage';

import styles from './Session.css';

type Props = {
  session: object
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
    const { session } = this.props;

    return (
      <div className={styles.container}>
        <Grid columns={2}>
          <Grid.Row>
            <Grid.Column width={8}>
              <Header as="h1" inverted>
                Data Server [{session.sessionType.toUpperCase()}]
              </Header>
            </Grid.Column>
            <Grid.Column width={8} textAlign="right">
              <Button
                icon="play"
                inverted
                color="green"
                content="Start"
                disabled={session.isRunning}
                onClick={() => {
                  ipcRenderer.send(ipcConstants.COMMAND, {
                    command: 'server:start',
                    sessionId: session.sessionId
                  });
                }}
              />
              <Button
                icon="stop"
                inverted
                color="red"
                content="Stop"
                disabled={!session.isRunning}
                onClick={() => {
                  ipcRenderer.send(ipcConstants.COMMAND, {
                    command: 'server:stop',
                    sessionId: session.sessionId
                  });
                }}
              />
              <Button
                icon="download"
                inverted
                color="blue"
                content="Download"
                onClick={() => {
                  ipcRenderer.send(ipcConstants.COMMAND, {
                    command: 'server:download',
                    sessionId: session.sessionId
                  });
                }}
              />
              <Button
                icon="trash"
                inverted
                color="orange"
                content="Remove"
                onClick={() => {
                  ipcRenderer.send(ipcConstants.COMMAND, {
                    command: 'server:remove',
                    sessionId: session.sessionId
                  });
                }}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Form
          error={!this.isSessionConfigValid()}
          inverted
          onSubmit={this.handleSubmit}
        >
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
        </Form>

        <Segment inverted>
          <Header as="h3" inverted>
            Laps
          </Header>
          <TimingFullPage sessionId={session.sessionId} />
        </Segment>
      </div>
    );
  }
}
