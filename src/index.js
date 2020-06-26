import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import App from "./component/App";
import "bootstrap/dist/css/bootstrap.css";
import registerServiceWorker from "./registerServiceWorker";
import Signin from "./component/Signin";
import Signup from "./component/Signup";
import Checkout from "./component/Checkout";

const Root = () => {
  return (
    <Router>
      <Switch>
        <Route component={App} exact path="/" />
        <Route component={Signin} path="/signin" />
        <Route component={Signup} path="/signup" />
        <Route component={Checkout} path="/checkout" />
      </Switch>
    </Router>
  );
};

ReactDOM.render(<Root />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
registerServiceWorker();
