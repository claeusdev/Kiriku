import React, { Component } from 'react';
import { Breadcrumb, Row, Col } from 'react-bootstrap';
import MemeIcon from 'react-icons/lib/ti/heart-full-outline';
import ArticleIcon from 'react-icons/lib/ti/news';
import GifIcon from 'react-icons/lib/ti/camera-outline';
import CircleIcon from 'react-icons/lib/ti/media-record';
import CollectionsIcon from 'react-icons/lib/ti/th-menu';

import { Card } from '../../../content';

import {
  isLoaded,
} from 'react-redux-firebase'
import { Link } from 'react-router-dom';

import './style.css';

const QuickLinksHeaderContent = () => {
  return (
    <h4 className="heading">What would you like to do?</h4>
  );
};

const QuickLinksBodyContent = () => {
  return (
    <div className="LunaAdmin-Content-Dashboard-QuickLinks-Items">
      <Link to="/" className="LunaAdmin-Content-Dashboard-QuickLinks-Item meme">
        <span className="svg-box"><MemeIcon /></span>
        <p>New Meme</p>
      </Link>
      <Link to="/" className="LunaAdmin-Content-Dashboard-QuickLinks-Item article">
        <span className="svg-box"><ArticleIcon /></span>
        <p>New Article</p>
      </Link>
      <Link to="/" className="LunaAdmin-Content-Dashboard-QuickLinks-Item gif">
        <span className="svg-box"><GifIcon /></span>
        <p>New Gif</p>
      </Link>
    </div>
  );
};


const CollectionsHeaderContent = () => {
  return (
    <h4 className="heading"> <CollectionsIcon /> View Collections</h4>
  );
};

const CollectionsBodyContent = () => {
  return (
    <div className="LunaAdmin-Content-Dashboard-Collections-Items">
      <Link to="/" className="LunaAdmin-Content-Dashboard-Collections-Item meme">
        <CircleIcon />
        Articles
      </Link>
      <Link to="/" className="LunaAdmin-Content-Dashboard-Collections-Item meme">
        <CircleIcon />
        Memes
      </Link>
      <Link to="/" className="LunaAdmin-Content-Dashboard-Collections-Item meme">
        <CircleIcon />
        GIFs
      </Link>
    </div>
  );
};

class Dashboard extends Component {
  render() {
    return (
      <div className="LunaAdmin-Content-Dashboard">
        <Breadcrumb>
          <Breadcrumb.Item active>Dashboard</Breadcrumb.Item>
        </Breadcrumb>
        <h3 className="LunaAdmin-Content-Dashboard-Greeting">Good Afternoon, Sheldon.</h3>
        {/* <p>Welcome home!</p> */}
        <Row className="show-grid">
          <Col xs={12} md={8} className="LunaAdmin-Content-Dashboard-QuickLinks">
            <Card HeaderContent={QuickLinksHeaderContent} BodyContent={QuickLinksBodyContent} />
          </Col>
          <Col xs={6} md={4} className="LunaAdmin-Content-Dashboard-Collections">
            <Card HeaderContent={CollectionsHeaderContent} BodyContent={CollectionsBodyContent} />
          </Col>
        </Row>
      </div>
    );
  }
}

export default Dashboard;

