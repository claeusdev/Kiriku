import React, { Component } from "react";
import { Breadcrumb, Row, Col } from "react-bootstrap";
import ArticleIcon from "react-icons/lib/ti/news";
import CircleIcon from "react-icons/lib/ti/media-record";
import CollectionsIcon from "react-icons/lib/ti/th-menu";

import { Card } from "../../../content";

import { isLoaded } from "react-redux-firebase";
import { Link } from "react-router-dom";

import "./style.css";

const QuickLinksHeaderContent = () => {
  return <h4 className="heading">What would you like to do?</h4>;
};

const QuickLinksBodyContent = () => {
  return (
    <div className="LunaAdmin-Content-Dashboard-QuickLinks-Items">
      <Link
        to="/admin/collections/article/new"
        className="LunaAdmin-Content-Dashboard-QuickLinks-Item article"
      >
        <span className="svg-box">
          <ArticleIcon />
        </span>
        <p>Post An Article</p>
      </Link>
    </div>
  );
};

const CollectionsHeaderContent = () => {
  return (
    <h4 className="heading">
      {" "}
      <CollectionsIcon /> View Collections
    </h4>
  );
};

const CollectionsBodyContent = () => {
  return (
    <div className="LunaAdmin-Content-Dashboard-Collections-Items">
      <Link
        to="/admin/collections/article"
        className="LunaAdmin-Content-Dashboard-Collections-Item"
      >
        <CircleIcon />
        Articles
      </Link>
    </div>
  );
};

class Dashboard extends Component {
  render() {
    let timeOfDay = "";
    const hour = new Date().getHours();

    if (hour > 12 && hour < 17) {
      timeOfDay = "Afternoon";
    } else if (hour >= 17 && hour <= 23) {
      timeOfDay = "Evening";
    } else {
      timeOfDay = "Morning";
    }

    return (
      <div className="LunaAdmin-Content-Dashboard">
        <Breadcrumb>
          <Breadcrumb.Item active>Dashboard</Breadcrumb.Item>
        </Breadcrumb>
        <h3 className="LunaAdmin-Content-Dashboard-Greeting">
          Good {timeOfDay}.
        </h3>
        <Row className="show-grid">
          <Col xs={6} md={6} className="LunaAdmin-Content-Dashboard-QuickLinks">
            <Card
              HeaderContent={QuickLinksHeaderContent}
              BodyContent={QuickLinksBodyContent}
            />
          </Col>
          <Col
            xs={6}
            md={6}
            className="LunaAdmin-Content-Dashboard-Collections"
          >
            <Card
              HeaderContent={CollectionsHeaderContent}
              BodyContent={CollectionsBodyContent}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default Dashboard;
