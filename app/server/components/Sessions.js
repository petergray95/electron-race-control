// @flow
import React, { Component } from 'react';
import { Header, Tab } from 'semantic-ui-react';
import Session from './Session';

type Props = {
  sessions: object
};

export default class Sessions extends Component<Props> {
  props: Props;

  render() {
    const { sessions } = this.props;

    const tabs = [];

    Object.keys(sessions).forEach(id => {
      const tab = {
        menuItem: `Session: ${id}`,
        render: () => (
          <Tab.Pane inverted attached={false}>
            <Session session={sessions[id]} />
          </Tab.Pane>
        )
      };
      tabs.push(tab);
    });

    const renderTabs = (
      <Tab
        menu={{ inverted: true, secondary: true, pointing: true }}
        panes={tabs}
      />
    );

    const renderNoTabs = (
      <Header as="h1" inverted>
        No servers or sessions loaded. Create a recorder or load a session to
        begin.
      </Header>
    );

    if (tabs.length === 0) {
      return renderNoTabs;
    }

    return renderTabs;
  }
}
