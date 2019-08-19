// @flow
import React, { Component } from 'react';
import Flexbox from 'flexbox-react';

import styles from './NumericWidget.css';

type Props = {
  channel: string,
  data: object
};

export default class NumericWidget extends Component<Props> {
  props: Props;

  render() {
    const { data, channel } = this.props;

    if (Object.keys(data).length === 0) {
      return <div>Placeholder</div>;
    }

    const layer = data[Object.keys(data)[0]];

    console.log(layer);

    return (
      <Flexbox flexDirection="column" minHeight="100%" minWidth="100%">
        <Flexbox className={styles.contents} flexGrow={1}>
          {layer[layer.length - 1][channel]}
        </Flexbox>
      </Flexbox>
    );
  }
}
