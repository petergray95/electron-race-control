// @flow
import React, { Component } from 'react';
import { Tab } from 'semantic-ui-react';
import LapsTable from './LapsTable';

type Props = {
  laps: object,
  participants: object
};

function getTimingPageHeader(participant) {
  return participant.driver.abbreviation
    ? participant.driver.abbreviation
    : participant.name.substring(0, 4).toUpperCase();
}

export default class TimingFull extends Component<Props> {
  props: Props;

  render() {
    const { laps, participants } = this.props;
    const tabs = [];

    Object.keys(laps).forEach(carId => {
      const participant = participants[carId];
      const tab = {
        menuItem: {
          key: carId,
          content: getTimingPageHeader(participant)
        },
        render: () => (
          <Tab.Pane inverted attached={false}>
            <LapsTable carId={carId} laps={laps} participant={participant} />
          </Tab.Pane>
        )
      };
      tabs.push(tab);
    });

    return <Tab menu={{ inverted: true, secondary: true }} panes={tabs} />;
  }
}
