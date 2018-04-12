import React, { Component } from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import './styles/Layout.css';
import classnames from 'classnames';

import { connect } from 'react-redux';
import { compose } from 'redux'
import {
  firebaseConnect,
  pathToJS,
} from 'react-redux-firebase'

import Home from './Home/Outlet';
import Quizzes from './Quizzes/Index';

const mapStateToProps = (state) => {
  return {
    auth: pathToJS(state.firebase, 'auth')
  };
};

const mapDispatchToProps = (dispatch) => ({
});

class Layout extends Component {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout() {
    const { firebase } = this.props;
    firebase.logout();
  }

  render() {
    const { location, history, auth } = this.props;
    const { handleLogout } = this;
    const url = location.pathname;

    const { displayName } = auth;

    const matchesCurrentUrl = (target, allowDescendantRoutes = false) => {
      if (!allowDescendantRoutes) {
        return target === url;
      }

      return url.startsWith(target);
    };

    const navigate = (history) => {
      return (path) => {
        history.push(path);
      }
    }

    const gotoPath = navigate(history);
    const gotoHome = () => { gotoPath('/dashboard') };
    const gotoQuizzes = () => { gotoPath('/dashboard/quizzes') };

    return (
      <div className="DashboardLayout">

        <div className="mobile-menu visible-xs">
          <Navbar collapseOnSelect>
            <Navbar.Header>
              <Navbar.Brand>
                <Link to="/dashboard">
                  <h1 className="brand">Quizzes<small>by OMG</small></h1>
                </Link>
              </Navbar.Brand>
              <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>

              <Nav className="link-list">
                <NavItem 
                  className={
                    classnames('link-item', { active: matchesCurrentUrl('/dashboard') })
                  } 
                  eventKey={1} 
                  onSelect={gotoHome}
                >Home</NavItem>
                <NavItem 
                  className={
                    classnames('link-item', { active: matchesCurrentUrl('/dashboard/quizzes', true) })
                  } eventKey={2} 
                  onSelect={gotoQuizzes}
                >Quizzes</NavItem>
              </Nav>


            </Navbar.Collapse>
          </Navbar>
        </div>

        <div id="left" className="column Sidebar hidden-xs">
          <div className="header">
            <Link className="logo" to="/dashboard">
              <h1 className="brand">Quizzes<small>by OMG</small></h1>
            </Link>
          </div>

          <div className="menu">
            <ul className="link-list">
              <li className={classnames('link-item', { active: matchesCurrentUrl('/dashboard') })}>
                <Link to="/dashboard">Home</Link>
              </li>
              <li className={classnames('link-item', { active: matchesCurrentUrl('/dashboard/quizzes', true) })}>
                <Link to="/dashboard/quizzes">Quizzes</Link>
              </li>
            </ul>

            <ul className="link-list">
              <li className="link-item faux-link-item greeting"><a>Hello, {displayName}!</a></li>
              <li className="link-item faux-link-item logout"><a onClick={handleLogout}>Logout</a></li>
            </ul>
          </div>

        </div>

        <div id="right" className="column Content">

          <Switch>
            <Route exact path="/dashboard" component={Home} />
            <Route path="/dashboard/quizzes" component={Quizzes} />
          </Switch>

        </div>
      </div>
    );
  }
}

const Container = compose(
  firebaseConnect([
  ]),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Layout)

export default Container;