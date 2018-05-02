import React, { Component } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
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
import LogoutIcon from 'react-icons/lib/ti/chevron-left-outline';

import Dashboard from './Dashboard/Container';
import Collections from './Collections';
import './style.css';


    const   Admin = (props) => {
    const { firebase, auth } = props;
    const userEmail = auth.email;
     const Npost = "New Post";

    return (
      <div className="LunaAdmin">

        <div className="header">
          <Navbar fixedTop collapseOnSelect>
            <Navbar.Header>
              <Navbar.Brand>
                <Link to="/admin">Apollo</Link>
              </Navbar.Brand>
              <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
              <Nav>
                {/* <NavItem eventKey={2} href="#"> <CollectionsIcon /> Collections </NavItem> */}
              </Nav>
              <Nav pullRight>
                

                <NavDropdown eventKey={2} href="#" className="new-post" title={ <NewPostIcon />  } > 
                  <MenuItem> <Link to="/admin/collections/meme/new" > Meme</Link> </MenuItem> 
                            <MenuItem divider />
                  <MenuItem> <Link to="/admin/collections/article/new" >  Article  </Link> </MenuItem> 
                            <MenuItem divider />                        
                  <MenuItem> <Link to="/admin/collections/gif/new" > Gif </Link> </MenuItem> 

                
                
                
                </NavDropdown>


                <NavDropdown eventKey={3} title={<UserInitialsCircle userName={userEmail} />} id="basic-nav-dropdown">
                  <MenuItem header>{userEmail}</MenuItem>
                  {/* <MenuItem eventKey={3.1}>Action</MenuItem>
                <MenuItem eventKey={3.2}>Another action</MenuItem>
                <MenuItem eventKey={3.3}>Something else here</MenuItem> */}
                  <MenuItem divider />
                  <MenuItem eventKey={3.3} onSelect={() => {
                    firebase.logout();
                  }}><LogoutIcon /> Logout</MenuItem>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </div>

        <div className="LunaAdmin-Content">
          <Grid>
            <Switch>
              <Route exact path="/admin" component={Dashboard} />
              <Route path="/admin/collections" component={Collections} />
            </Switch>
          </Grid>
        </div>
      </div>
    );
  };

export default Admin;

