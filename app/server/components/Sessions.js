// @flow
import React, { Component } from 'react';
import { Header, Icon, Tab } from 'semantic-ui-react';
import SessionLivePage from '../containers/SessionLivePage';
import SessionHistoricPage from '../containers/SessionHistoricPage';

type Props = {
  sessions: object
};

export default class Sessions extends Component<Props> {
  props: Props;

  render() {
    const { sessions } = this.props;

    if (Object.keys(sessions).length === 0) {
      return (
        <Header as="h1" inverted>
          No servers or sessions loaded. Create a recorder or load a session to
          begin.
        </Header>
      );
    }

    const tabs = [];

    Object.keys(sessions).forEach((sessionId, index) => {
      const session = sessions[sessionId];
      const tab = {
        menuItem: {
          key: sessionId,
          content: `${index + 1}: ${session.name}`,
          icon: (
            <Icon
              name="circle outline"
              color={session.isRunning ? 'green' : 'grey'}
            />
          )
        },
        render: () => (
          <Tab.Pane inverted attached={false}>
            {(() => {
              switch (session.sessionType) {
                case 'live': {
                  return <SessionLivePage sessionId={sessionId} />;
                }
                case 'historic': {
                  return <SessionHistoricPage sessionId={sessionId} />;
                }
                default: {
                  return null;
                }
              }
            })()}
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
