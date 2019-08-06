// @flow
import React, { Component } from 'react';

type Props = {
  channel: string,
  onClose: method
};

export default class HeaderWidget extends Component<Props> {
  props: Props;

  render() {
    const { onClose, channel } = this.props;
    const title = `Channel: ${channel}`;
    return (
      <div role="button" onClick={onClose} onKeyPress={() => {}} tabIndex={0}>
        {title}
      </div>
    );
  }
}
