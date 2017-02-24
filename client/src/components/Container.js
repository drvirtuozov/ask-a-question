import React from 'react';
import NavigationBar from './NavigationBar';
import FlashMessages from './flash/FlashMessages';
import { Col } from 'react-bootstrap';


export default class Container extends React.Component {
  render() {
    return (
      <Col lg={6} lgOffset={3} style={{ marginTop: '50px' }}>
        <NavigationBar />
        <FlashMessages />
        {this.props.children}
      </Col>
    );
  }
}