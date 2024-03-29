// @flow
import React, { Component } from 'react';
import update from 'immutability-helper';
import { Button, Checkbox, Icon, Table } from 'semantic-ui-react';
import _ from 'lodash';
import Moment from 'react-moment';
import { ipcRenderer } from 'electron-better-ipc';
import ipcConstants from '../../../shared/constants/ipc-channels';

import styles from './LapsTable.css';

type Props = {
  carId: number,
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

  renderLaps(carId, allLaps) {
    const laps = allLaps.filter(lap => lap.carId === carId);
    const validLaps = laps.filter(lap => lap.isValid && lap.isFullLap);
    const purpleSectors = {
      sector1Time: Math.min(...validLaps.map(lap => lap.sector1Time)),
      sector2Time: Math.min(...validLaps.map(lap => lap.sector2Time)),
      sector3Time: Math.min(...validLaps.map(lap => lap.sector3Time)),
      lapTime: Math.min(...validLaps.map(lap => lap.lapTime)),
      sector1SpeedTrap: Math.max(...validLaps.map(lap => lap.sector1SpeedTrap)),
      sector2SpeedTrap: Math.max(...validLaps.map(lap => lap.sector2SpeedTrap)),
      sector3SpeedTrap: Math.max(...validLaps.map(lap => lap.sector3SpeedTrap))
    };

    return laps.map(lap => (
      <Table.Row disabled={!lap.isFullLap || !lap.isValid} key={lap.id}>
        <Table.Cell>{lap.number}</Table.Cell>
        <Table.Cell style={{ color: lap.tyreCompound.color }}>
          {lap.tyreCompound.name}
        </Table.Cell>
        <Table.Cell>{lap.fuelInTank}</Table.Cell>
        <Table.Cell
          className={
            lap.lapTime === purpleSectors.lapTime ? styles.fastest : null
          }
        >
          {lap.isFullLap && (
            <Moment unix format="mm:ss.SSS">
              {lap.lapTime}
            </Moment>
          )}
        </Table.Cell>
        <Table.Cell
          className={
            lap.sector1Time === purpleSectors.sector1Time
              ? styles.fastest
              : null
          }
        >
          {lap.sector1Time && (
            <Moment unix format="ss.SSS">
              {lap.sector1Time}
            </Moment>
          )}
        </Table.Cell>
        <Table.Cell
          className={
            lap.sector1SpeedTrap === purpleSectors.sector1SpeedTrap
              ? styles.fastest
              : null
          }
        >
          {lap.sector1SpeedTrap}
        </Table.Cell>
        <Table.Cell
          className={
            lap.sector2Time === purpleSectors.sector2Time
              ? styles.fastest
              : null
          }
        >
          {lap.sector2Time && (
            <Moment unix format="ss.SSS">
              {lap.sector2Time}
            </Moment>
          )}
        </Table.Cell>
        <Table.Cell
          className={
            lap.sector2SpeedTrap === purpleSectors.sector2SpeedTrap
              ? styles.fastest
              : null
          }
        >
          {lap.sector2SpeedTrap}
        </Table.Cell>
        <Table.Cell
          className={
            lap.sector3Time === purpleSectors.sector3Time
              ? styles.fastest
              : null
          }
        >
          {lap.sector3Time && (
            <Moment unix format="ss.SSS">
              {lap.sector3Time}
            </Moment>
          )}
        </Table.Cell>
        <Table.Cell
          className={
            lap.sector3SpeedTrap === purpleSectors.sector3SpeedTrap
              ? styles.fastest
              : null
          }
        >
          {lap.sector3SpeedTrap}
        </Table.Cell>
        <Table.Cell>
          <Moment unix format="HH.mm.ss">
            {lap.endTime / 1000}
          </Moment>
        </Table.Cell>
        <Table.Cell>
          {lap.isValid && <Icon color="green" name="checkmark" size="large" />}
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
    const { carId, laps } = this.props;
    const { selections } = this.state;
    return (
      <Table inverted selectable textAlign="center">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Number</Table.HeaderCell>
            <Table.HeaderCell>Compound</Table.HeaderCell>
            <Table.HeaderCell>Fuel</Table.HeaderCell>
            <Table.HeaderCell>Time</Table.HeaderCell>
            <Table.HeaderCell>S1</Table.HeaderCell>
            <Table.HeaderCell>kph</Table.HeaderCell>
            <Table.HeaderCell>S2</Table.HeaderCell>
            <Table.HeaderCell>kph</Table.HeaderCell>
            <Table.HeaderCell>S3</Table.HeaderCell>
            <Table.HeaderCell>kph</Table.HeaderCell>
            <Table.HeaderCell>ToD</Table.HeaderCell>
            <Table.HeaderCell>Valid</Table.HeaderCell>
            <Table.HeaderCell>Complete</Table.HeaderCell>
            <Table.HeaderCell>Export</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>{this.renderLaps(carId, laps)}</Table.Body>
        <Table.Footer fullWidth>
          <Table.Row>
            <Table.HeaderCell colSpan="14">
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
