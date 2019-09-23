// @flow
import React, { Component } from 'react';
import { Button, Checkbox, Icon, Table } from 'semantic-ui-react';

type Props = {
  laps: object
};

export default class LapsTable extends Component<Props> {
  props: Props;

  render() {
    const { laps } = this.props;

    return (
      <Table inverted selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Number</Table.HeaderCell>
            <Table.HeaderCell>Time</Table.HeaderCell>
            <Table.HeaderCell>Valid</Table.HeaderCell>
            <Table.HeaderCell>Complete</Table.HeaderCell>
            <Table.HeaderCell>Export</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>{renderLaps(laps)}</Table.Body>
        <Table.Footer fullWidth>
          <Table.Row>
            <Table.HeaderCell colSpan="5">
              <Button
                floated="right"
                icon
                labelPosition="left"
                primary
                size="small"
              >
                <Icon name="download" /> Export Lap(s)
              </Button>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    );
  }
}

function renderLaps(laps) {
  return laps.map(lap => (
    <Table.Row disabled={!lap.isFullLap} key={lap.id}>
      <Table.Cell>{lap.number}</Table.Cell>
      <Table.Cell>{lap.lapTime.toFixed(3)}</Table.Cell>
      <Table.Cell>
        {!lap.isValid && <Icon color="green" name="checkmark" size="large" />}
      </Table.Cell>
      <Table.Cell>
        {lap.isFullLap && <Icon color="green" name="checkmark" size="large" />}
      </Table.Cell>
      <Table.Cell>
        <Checkbox slider />
      </Table.Cell>
    </Table.Row>
  ));
}
