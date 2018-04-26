// collections/article

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

class CollectionsArticleList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			listenersSet: false
		};
	}

	componentDidMount() {
		// console.log('--->');
		// const { firestore, articles, tags, countries } = this.props;
		// if (!isLoaded(articles) || !isLoaded(tags) || !isLoaded(countries)) {
		// 	console.log('wait');
		// } else {
		// 	console.log('dont wait');
		// }

		// console.log(this.props);
		// const { firestore } = this.props;

		// firestore.setListener({
		// 	collection: 'articles_tags',
		//   storeAs: `tags_for_article_${'dtSNYEvg0aZ0fqrYb82t'}`,
		//   where: ['articleId', '==', 'dtSNYEvg0aZ0fqrYb82t']
		// });
	}

	componentWillReceiveProps(nextProps) {
		const { firestore, articles, tags, countries } = nextProps;
		const { listenersSet } = this.state;

		if (isLoaded(articles) && isLoaded(tags) && isLoaded(countries) && !listenersSet) {
			articles.forEach(article => {
				firestore.setListener({
					collection: 'articles_tags',
					where: ['articleId', '==', article.id]
				});
			});

			this.setState({ listenersSet: true });
		}
	}

	componentWillUnmount() {

	}


	render() {
		const { articles, tags, countries, firebase } = this.props;
		if (!isLoaded(articles) || !isLoaded(tags) || !isLoaded(countries)) {
			return (
				<div className="LunaAdmin-Content-Collections-Article-List">
					<h2 className="LunaAdmin-Content-Collections-Article-List-Heading">Foo Ghazi</h2>
					<p>Loading articles...</p>
				</div>
			);
		}

		const articlesList = articles.map(article => {
			const {
				createdAt,
				lastUpdatedAt,
				publishedAt,
				status,
				author,
				tags,
				countries
			} = article;
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
						<a href="">{article.title}</a>
					</td>
					<td>{tagsList}</td>
					<td>{author.fullName}</td>
					<td>{countriesList}</td>
					<td>{dateAction} {dateAgo}</td>
				</tr>
			);
		});

		return (
			<div className="LunaAdmin-Content-Collections-Article-List">
				<div className="LunaAdmin-Content-Collections-Article-List-Header">
					<h2 className="LunaAdmin-Content-Collections-Article-List-Header-Heading">Articles</h2>
					<Link to="/admin/collections/article/new" className="LunaAdmin-Content-Collections-Article-List-Header-NewButton btn"><PlusIcon /> Add New</Link>
				</div>
				<div className="LunaAdmin-Content-Collections-Article-List-FiltersPlusSearch">
					<div className="LunaAdmin-Content-Collections-Article-List-Filters">
						<span className="LunaAdmin-Content-Collections-Article-List-FilterCriteria">
							<a href="">All</a>
							(100)
						</span>
						<span className="LunaAdmin-Content-Collections-Article-List-FilterCriteria">
							<a href="">Published</a>
							(75)
						</span>
						<span className="LunaAdmin-Content-Collections-Article-List-FilterCriteria">
							<a href="">Drafts</a>
							(25)
						</span>
						<span className="LunaAdmin-Content-Collections-Article-List-FilterCriteria">
							<a href="">Mine</a>
							(13)
						</span>
					</div>
					<div className="LunaAdmin-Content-Collections-Article-List-Search">
					</div>
				</div>

				<div className="LunaAdmin-Content-Collections-Article-List-Items">
					{articles.length > 0 &&
						<div>
							<Table condensed hover responsive>
								<thead>
									<tr>
										<th>
											<input type="checkbox" />
										</th>
										<th className="title-cell">Title</th>
										<th>Tags</th>
										<th>Author</th>
										<th>Country</th>
										<th>Date</th>
									</tr>
								</thead>
								<tbody>
									{articlesList}
								</tbody>
							</Table>
							{/* <Pager>
						<Pager.Item previous href="#"> &larr; Previous </Pager.Item>
						<Pager.Item disabled next href="#"> Next &rarr; </Pager.Item>
					</Pager> */}
						</div>
					}
					{articles.length === 0 &&
						<p>No articles to show. You can create some.</p>
					}
				</div>
			</div>
		);
	}
}

export default CollectionsArticleList;