import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Article from './Article';
import Gif from './Gif';
import Meme from './Meme';

export default () => {
	return (
		<div className="LunaAdmin-Content-Collections">
			<Switch>
				<Route path="/admin/collections/article" component={Article} />
				<Route path="/admin/collections/gif" component={Gif} />
				<Route path="/admin/collections/meme" component={Meme} />
			</Switch>
		</div>
	);
};