// @flow
import React, { Component } from 'react';
import { Header, Tab } from 'semantic-ui-react';
import SessionPage from '../containers/SessionPage';

type Props = {
  sessionIds: array
};

export default class Sessions extends Component<Props> {
  props: Props;

  render() {
    const { sessionIds } = this.props;

    if (sessionIds.length === 0) {
      return (
        <Header as="h1" inverted>
          No servers or sessions loaded. Create a recorder or load a session to
          begin.
        </Header>
      );
    }

    const tabs = [];

    sessionIds.forEach((sessionId, index) => {
      const tab = {
        menuItem: `Session ${index + 1}`,
        render: () => (
          <Tab.Pane inverted attached={false}>
            <SessionPage sessionId={sessionId} />
          </Tab.Pane>
        )
      };
      tabs.push(tab);
    });

    return (
      <Tab
        menu={{ inverted: true, secondary: true, pointing: true }}
        panes={tabs}
      />
    );
  }
}
