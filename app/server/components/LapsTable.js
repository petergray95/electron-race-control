// @flow
import React, { Component } from 'react';
import update from 'immutability-helper';
import { Button, Checkbox, Icon, Table } from 'semantic-ui-react';
import _ from 'lodash';
import Moment from 'react-moment';
import { ipcRenderer } from 'electron-better-ipc';
import ipcConstants from '../../../shared/constants/ipc-channels';

type Props = {
  laps: object
};

export default class LapsTable extends Component<Props> {
  props: Props;

  state = {
    selections: {}
  };

  handleSelect = id => {
    this.setState(prevState => {
      if (prevState.selections[id]) {
        return update(prevState, {
          selections: { $unset: [id] }
        });
      }

      return update(prevState, {
        selections: { [id]: { $set: true } }
      });
    });
  };

  isLapSelected = id => _.get(this.state, ['selections', id], false);

  renderLaps(laps) {
    return laps.map(lap => (
      <Table.Row disabled={!lap.isFullLap} key={lap.id}>
        <Table.Cell>{lap.number}</Table.Cell>
        <Table.Cell>
          <Moment unix format="HH:mm:ss">
            {lap.startTime / 1000}
          </Moment>
        </Table.Cell>
        <Table.Cell>
          <Moment unix format="mm:ss.SSS">
            {lap.lapTime}
          </Moment>
        </Table.Cell>
        <Table.Cell>
          {!lap.isValid && <Icon color="green" name="checkmark" size="large" />}
        </Table.Cell>
        <Table.Cell>
          {lap.isFullLap && (
            <Icon color="green" name="checkmark" size="large" />
          )}
        </Table.Cell>
        <Table.Cell>
          <Checkbox
            checked={this.isLapSelected(lap.id)}
            onChange={() => this.handleSelect(lap.id)}
          />
        </Table.Cell>
      </Table.Row>
    ));
  }

  exportLaps = () => {
    const { laps } = this.props;
    const { selections } = this.state;
    const lapIds = Object.keys(selections);
    ipcRenderer.send(ipcConstants.COMMAND, {
      command: 'server:export_laps',
      laps: laps.filter(lap => lapIds.includes(lap.id))
    });
  };

  render = () => {
    const { laps } = this.props;
    const { selections } = this.state;
    return (
      <Table inverted selectable textAlign="center">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Number</Table.HeaderCell>
            <Table.HeaderCell>Start</Table.HeaderCell>
            <Table.HeaderCell>Time</Table.HeaderCell>
            <Table.HeaderCell>Valid</Table.HeaderCell>
            <Table.HeaderCell>Complete</Table.HeaderCell>
            <Table.HeaderCell>Export</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>{this.renderLaps(laps)}</Table.Body>
        <Table.Footer fullWidth>
          <Table.Row>
            <Table.HeaderCell colSpan="6">
              <Button
                floated="right"
                icon
                labelPosition="left"
                primary
                size="small"
                disabled={Object.keys(selections).length === 0}
                onClick={this.exportLaps}
              >
                <Icon name="download" /> Export Lap(s)
              </Button>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    );
  };
}
