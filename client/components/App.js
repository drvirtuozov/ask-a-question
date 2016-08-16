import React from 'react';
import NavigationBar from './NavigationBar';
import FlashMessages from './flash/FlashMessages';

export default class App extends React.Component {
  render() {
    return (
      <div className="container">
        <NavigationBar />
        <FlashMessages />
        {this.props.children}
      </div>
    );
  }
}