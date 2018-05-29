// collections/article

import React from 'react';
import { Breadcrumb, Row, Col } from 'react-bootstrap';
import { Switch, Route, Link } from 'react-router-dom';
import List from './List/Container';
import New from './New/Container';
import Show from './Show/Container';

export default () => {
	return (
		<div className="LunaAdmin-Content-Collections-Article">

			<ol role="navigation" aria-label="breadcrumbs" className="breadcrumb">
				<li className="">
					<Link to="/admin">Collections</Link>
				</li>
				<li className="active"><span>Article</span></li>
			</ol>

			<Switch>
				<Route exact path="/admin/collections/article" component={List} />
				<Route exact path="/admin/collections/article/new" component={New} />
				<Route exact path="/admin/collections/article/:article_id" component={Show} />
			</Switch>
		</div>
	);
};