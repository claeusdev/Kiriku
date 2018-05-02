// collections/gif

import React, { Component } from 'react';
import { isLoaded, isEmpty } from 'react-redux-firebase'
import { Link } from 'react-router-dom';
import {
	Breadcrumb,
	Row,
	Col,
	FormGroup,
	FormControl,
	HelpBlock,
	ControlLabel,
	DropdownButton,
	MenuItem,
	Table,
	Pager
} from 'react-bootstrap';
import PlusIcon from 'react-icons/lib/ti/plus';

import './style.css';
import moment from 'moment';

class CollectionsGifList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			listenersSet: false
		};
	}

	componentWillReceiveProps(nextProps) {
		const { firestore, gifs, tags, countries } = nextProps;
		const { listenersSet } = this.state;

		if (isLoaded(gifs) && isLoaded(tags) && isLoaded(countries) && !listenersSet) {
			gifs.forEach(gif => {
				firestore.setListener({
					collection: 'gifs_tags',
					where: ['gifId', '==', gif.id]
				});
			});

			this.setState({ listenersSet: true });
		}
	}

	componentWillUnmount() {

	}


	render() {
		const { gifs, tags, countries, firebase } = this.props;
		if (!isLoaded(gifs)) {
			return (
				<div className="LunaAdmin-Content-Collections-Gif-List">
					<div className="LunaAdmin-Content-Collections-Gif-List-Header">
						<h2 className="LunaAdmin-Content-Collections-Gif-List-Header-Heading">Gifs</h2>
						<Link to="/admin/collections/gif/new" className="LunaAdmin-Content-Collections-Gif-List-Header-NewButton btn"><PlusIcon /> Add New</Link>
					</div>
					<p>Loading gifs...</p>
				</div>
			);
		}

		const gifsList = gifs.map(gif => {
			const {
				createdAt,
				lastUpdatedAt,
				publishedAt,
				status,
				author = {},
				tags,
				countries
			} = gif;
			const dateAction = status === 'published' ? 'Published' : 'Updated';
			const dateToUse = status === 'published' ? publishedAt : lastUpdatedAt;
			const dateAgo = dateToUse ? moment(dateToUse).fromNow() : '';
			const tagsList = tags.reduce((acc, current, currentIndex) => {
				return `${acc}${current.name}${currentIndex < tags.length - 1 ? ', ' : ''}`;
			}, '');

			const countriesList = countries.reduce((acc, current, currentIndex) => {
				return `${acc}${current.name}${currentIndex < countries.length - 1 ? ', ' : ''}`;
			}, '');

			return (
				<tr>
					<td>
						<input type="checkbox" />
					</td>
					<td>
						<Link to={`/admin/collections/gif/${gif.id}`}>{gif.description}</Link>
					</td>
					<td><img src={gif.imageUrl} width="50" /></td>
					<td>{tagsList}</td>
					<td>{author.fullName}</td>
					<td>{countriesList}</td>
					<td>{dateAction} {dateAgo}</td>
				</tr>
			);
		});

		return (
			<div className="LunaAdmin-Content-Collections-Gif-List">
				<div className="LunaAdmin-Content-Collections-Gif-List-Header">
					<h2 className="LunaAdmin-Content-Collections-Gif-List-Header-Heading">Gifs</h2>
					<Link to="/admin/collections/gif/new" className="LunaAdmin-Content-Collections-Gif-List-Header-NewButton btn"><PlusIcon /> Add New</Link>
				</div>
				<div className="LunaAdmin-Content-Collections-Gif-List-FiltersPlusSearch">
					<div className="LunaAdmin-Content-Collections-Gif-List-Filters">
						<span className="LunaAdmin-Content-Collections-Gif-List-FilterCriteria">
							<a href="">All</a>
							(100)
						</span>
						<span className="LunaAdmin-Content-Collections-Gif-List-FilterCriteria">
							<a href="">Published</a>
							(75)
						</span>
						<span className="LunaAdmin-Content-Collections-Gif-List-FilterCriteria">
							<a href="">Drafts</a>
							(25)
						</span>
						<span className="LunaAdmin-Content-Collections-Gif-List-FilterCriteria">
							<a href="">Mine</a>
							(13)
						</span>
					</div>
					<div className="LunaAdmin-Content-Collections-Gif-List-Search">
					</div>
				</div>

				<div className="LunaAdmin-Content-Collections-Gif-List-Items">
					{gifs.length > 0 &&
						<div>
							<Table condensed hover responsive>
								<thead>
									<tr>
										<th>
											<input type="checkbox" />
										</th>
										<th className="title-cell">Title</th>
										<th>Preview</th>
										<th>Tags</th>
										<th>Author</th>
										<th>Country</th>
										<th>Date</th>
									</tr>
								</thead>
								<tbody>
									{gifsList}
								</tbody>
							</Table>
							{/* <Pager>
						<Pager.Item previous href="#"> &larr; Previous </Pager.Item>
						<Pager.Item disabled next href="#"> Next &rarr; </Pager.Item>
					</Pager> */}
						</div>
					}
					{gifs.length === 0 &&
						<p>No gifs to show. You can create some.</p>
					}
				</div>
			</div>
		);
	}
}

export default CollectionsGifList;