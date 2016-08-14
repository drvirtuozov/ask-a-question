import React from 'react';
import NavigationBar from './NavigationBar';

export default class App extends React.Component {
  render() {
    return (
      <div className="container">
        <NavigationBar />
        {this.props.children}
      </div>
    );
  }
}