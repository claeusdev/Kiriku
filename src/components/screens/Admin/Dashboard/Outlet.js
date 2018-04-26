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
        <p>Post A Meme</p>
      </Link>
      <Link to="/admin/collections/article/new" className="LunaAdmin-Content-Dashboard-QuickLinks-Item article">
        <span className="svg-box"><ArticleIcon /></span>
        <p>Post An Article</p>
      </Link>
      <Link to="/" className="LunaAdmin-Content-Dashboard-QuickLinks-Item gif">
        <span className="svg-box"><GifIcon /></span>
        <p>Post A Gif</p>
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
      <Link to="/admin/collections/article" className="LunaAdmin-Content-Dashboard-Collections-Item meme">
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
    let timeOfDay = '';
    const hour = new Date().getHours();

    if (hour > 12 && hour < 17) {
      timeOfDay = 'Afternoon';
    } else if (hour >= 17 && hour <= 23) {
      timeOfDay = 'Evening';
    } else {
      timeOfDay = 'Morning';
    }

    return (
      <div className="LunaAdmin-Content-Dashboard">
        <Breadcrumb>
          <Breadcrumb.Item active>Dashboard</Breadcrumb.Item>
        </Breadcrumb>
        <h3 className="LunaAdmin-Content-Dashboard-Greeting">Good {timeOfDay}.</h3>
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

