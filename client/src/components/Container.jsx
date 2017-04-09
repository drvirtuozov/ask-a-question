import React from 'react';
import { Col } from 'react-bootstrap';
import NavigationBar from './NavigationBar';
import FlashMessages from './flash/FlashMessages';


export default function (props) {
  return (
    <Col lg={6} lgOffset={3} style={{ marginTop: '60px' }}>
      <NavigationBar />
      <FlashMessages />
      {props.children}
    </Col>
  );
}
