// @flow
import React, { Component } from 'react';
import BaseWidget from '../../components/widgets/BaseWidget';

type Props = {
  onClose: method
};

export default class BaseWidgetPage extends Component<Props> {
  props: Props;

  render() {
    const { onClose } = this.props;
    return <BaseWidget onClose={onClose} />;
  }
}
