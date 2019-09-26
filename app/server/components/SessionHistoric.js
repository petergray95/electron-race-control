// @flow
import React, { Component } from 'react';
import { Button, Grid, Header, Form, Segment } from 'semantic-ui-react';
import { ipcRenderer } from 'electron-better-ipc';
import ipcConstants from '../../../shared/constants/ipc-channels';
import TimingFullPage from '../containers/TimingFullPage';

import styles from './Session.css';

type Props = {
  session: object
};

export default class SessionHistoric extends Component<Props> {
  props: Props;

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
              <Button.Group>
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
              </Button.Group>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Form inverted onSubmit={this.handleSubmit}>
          <Header as="h3" inverted>
            Configuration
          </Header>
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
