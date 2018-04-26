// collections/article

import React from 'react';
import { Breadcrumb, Row, Col } from 'react-bootstrap';
import { Switch, Route } from 'react-router-dom';
import List from './List/Container';
import New from './New/Container';

export default () => {
	return (
		<div className="LunaAdmin-Content-Collections-Article">
			<Breadcrumb>
				<Breadcrumb.Item>Collections</Breadcrumb.Item>
				<Breadcrumb.Item active>Article</Breadcrumb.Item>
			</Breadcrumb>
			<Switch>
				<Route exact path="/admin/collections/article" component={List} />
				<Route exact path="/admin/collections/article/new" component={New} />
			</Switch>
		</div>
	);
};