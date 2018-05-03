// collections/meme

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

class CollectionsMemeList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			listenersSet: false
		};
	}

	componentWillReceiveProps(nextProps) {
		const { firestore, memes, tags, countries } = nextProps;
		const { listenersSet } = this.state;

		if (isLoaded(memes) && isLoaded(tags) && isLoaded(countries) && !listenersSet) {
			memes.forEach(meme => {
				firestore.setListener({
					collection: 'memes_tags',
					where: ['memeId', '==', meme.id]
				});
			});

			this.setState({ listenersSet: true });
		}
	}

	componentWillUnmount() {

	}


	render() {
		const { memes, tags, countries, firebase } = this.props;
		if (!isLoaded(memes)) {
			return (
				<div className="LunaAdmin-Content-Collections-Meme-List">
					<div className="LunaAdmin-Content-Collections-Meme-List-Header">
						<h2 className="LunaAdmin-Content-Collections-Meme-List-Header-Heading">Memes</h2>
						<Link to="/admin/collections/meme/new" className="LunaAdmin-Content-Collections-Meme-List-Header-NewButton btn"><PlusIcon /> Add New</Link>
					</div>
					<p>Loading memes...</p>
				</div>
			);
		}

		const memesList = memes.map(meme => {
			const {
				createdAt,
				lastUpdatedAt,
				publishedAt,
				status,
				author = {},
				tags,
				countries
			} = meme;
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
						<Link to={`/admin/collections/meme/${meme.id}`}>{meme.description}</Link>
					</td>
					<td><img src={meme.imageUrl} width="50" /></td>
					<td>{tagsList}</td>
					<td>{author.fullName}</td>
					<td>{countriesList}</td>
					<td>{dateAction} {dateAgo}</td>
				</tr>
			);
		});

		return (
			<div className="LunaAdmin-Content-Collections-Meme-List">
				<div className="LunaAdmin-Content-Collections-Meme-List-Header">
					<h2 className="LunaAdmin-Content-Collections-Meme-List-Header-Heading">Memes</h2>
					<Link to="/admin/collections/meme/new" className="LunaAdmin-Content-Collections-Meme-List-Header-NewButton btn"><PlusIcon /> Add New</Link>
				</div>
				<div className="LunaAdmin-Content-Collections-Meme-List-FiltersPlusSearch">
					<div className="LunaAdmin-Content-Collections-Meme-List-Filters">
						<span className="LunaAdmin-Content-Collections-Meme-List-FilterCriteria">
							<a href="">All</a>
							(100)
						</span>
						<span className="LunaAdmin-Content-Collections-Meme-List-FilterCriteria">
							<a href="">Published</a>
							(75)
						</span>
						<span className="LunaAdmin-Content-Collections-Meme-List-FilterCriteria">
							<a href="">Drafts</a>
							(25)
						</span>
						<span className="LunaAdmin-Content-Collections-Meme-List-FilterCriteria">
							<a href="">Mine</a>
							(13)
						</span>
					</div>
					<div className="LunaAdmin-Content-Collections-Meme-List-Search">
					</div>
				</div>

				<div className="LunaAdmin-Content-Collections-Meme-List-Items">
					{memes.length > 0 &&
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
									{memesList}
								</tbody>
							</Table>
							{/* <Pager>
						<Pager.Item previous href="#"> &larr; Previous </Pager.Item>
						<Pager.Item disabled next href="#"> Next &rarr; </Pager.Item>
					</Pager> */}
						</div>
					}
					{memes.length === 0 &&
						<p>No memes to show. You can create some.</p>
					}
				</div>
			</div>
		);
	}
}

export default CollectionsMemeList;