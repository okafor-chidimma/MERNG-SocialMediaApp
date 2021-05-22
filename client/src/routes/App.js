import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Container } from "semantic-ui-react";

import "semantic-ui-css/semantic.min.css";
import "../App.css";
import MenuBar from "../components/MenuBar";
import Home from "../components/Home";
import Register from "../components/Register";
import Login from "../components/Login";
import DoesNotExist from "../components/DoesNotExist";
import AuthProvider from "../context/AuthProvider";
import PrivateRoute from "./PrivateRoute";
import SinglePost from "../components/SinglePost";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Container>
          <MenuBar />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/posts/:postId" component={SinglePost} />

            <PrivateRoute exact path="/register" component={Register} />
            <PrivateRoute exact path="/login" component={Login} />
            <Route component={DoesNotExist} />
          </Switch>
        </Container>
      </Router>
    </AuthProvider>
  );
};

export default App;
