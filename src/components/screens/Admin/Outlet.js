import React from 'react';
import { Switch, Route } from 'react-router-dom';
import {
  Nav,
  Navbar,
  NavDropdown,
  NavItem,
  MenuItem,
  Grid,
  Row,
  Col
} from 'react-bootstrap';
import UserInitialsCircle from '../../misc/UserInitialsCircle';
import CollectionsIcon from 'react-icons/lib/ti/book';
import NewPostIcon from 'react-icons/lib/ti/edit';

import Dashboard from './Dashboard/Container';
import './style.css';

const Home = () => {
  return (
    <div className="LunaAdmin">

      <div className="header">
        <Navbar fixedTop collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="#brand">Luna</a>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              {/* <NavItem eventKey={2} href="#"> <CollectionsIcon /> Collections </NavItem> */}
            </Nav>
            <Nav pullRight>
              <NavItem eventKey={2} href="#" className="new-post"> <NewPostIcon /> New Post </NavItem>
              <NavDropdown eventKey={3} title={<UserInitialsCircle userName="Sheldon" />} id="basic-nav-dropdown">
                <MenuItem header>Wossop, Sheldon!</MenuItem>
                {/* <MenuItem eventKey={3.1}>Action</MenuItem>
                <MenuItem eventKey={3.2}>Another action</MenuItem>
                <MenuItem eventKey={3.3}>Something else here</MenuItem> */}
                <MenuItem divider />
                <MenuItem eventKey={3.3}>Logout</MenuItem>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>

      <div className="LunaAdmin-Content">
        <Grid>
          <Switch>
            <Route exact path="/admin" component={Dashboard} />
            <Route path="/collections" component={() => <p>Collections</p>} />
          </Switch>
        </Grid>
      </div>
    </div>
  );
};

export default Home;

