"use strict";

import {React} from "react";
import {ReactDOM} from "react-dom";
import {ReactRouter} from "react-router";

class App extends React.Component {
  render() {
    return "Hello world!";
  }
}

ReactDOM.render(<App />, document.getElementById("app"));