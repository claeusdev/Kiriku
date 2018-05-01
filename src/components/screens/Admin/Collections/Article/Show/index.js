// collections/article/show

import React, { Component } from 'react';
import { 
	Breadcrumb, 
	Row, 
	Col, 
	FormGroup, 
	FormControl, 
	HelpBlock,
	ControlLabel,
	DropdownButton,
	MenuItem
} from 'react-bootstrap';
import { UpdateArticleForm } from '../../../../../forms';

import {
  isLoaded
} from 'react-redux-firebase'

import './style.css';

class CollectionsArticleNew extends Component {
	constructor(props) {
		super(props);

		this.state = {
			saving: false
		};

		this.handleSave = this.handleSave.bind(this);
		this.saveArticle = this.saveArticle.bind(this);
		this.linkArticleWithTags = this.linkArticleWithTags.bind(this);
	}
	
	saveArticle(article) {
		const { firestore } = this.props;
		return firestore.add('articles', article)
	} linkArticleWithTags(articleId, tags) {
		return new Promise((resolve, reject) => {
			const { firestore } = this.props;

			const linkTagRequests = tags.map(tag => {
				return firestore.set(`/articles_tags/${articleId}_${tag}`, {
					articleId,
					tagId: tag
				});
			});

			Promise.all(linkTagRequests)
				.then(() => {
					resolve(articleId);
				})
				.catch((error) => {
					reject(error);
				});
		});
	}

	linkArticleWithCountries(articleId, countries) {
		const { firestore } = this.props;

		const linkCountryRequests = countries.map(country => {
			return firestore.set(`/articles_countries/${articleId}_${country}`, {
				articleId,
				countryId: country
			});
		});

		return Promise.all(linkCountryRequests)
	}

	handleSave(article) {
		const { firestore, onSave } = this.props;

		article.tags = article.tags.map(tag => tag.value);
		article.countries = article.countries.map(countrie => countrie.value);

		const { tags, countries } = article;

		this.setState({ saving: true });
		this.saveArticle(article)
		.then((savedArticle) => {
			const savedArticleId = savedArticle._key.path.segments[1]
			return this.linkArticleWithTags(savedArticleId, tags);
		})
		.then((savedArticleId) => {
			return this.linkArticleWithCountries(savedArticleId, countries);
		})
		.then((result) => {
			this.setState({ saving: false });
			onSave();
		})
		.catch((error) => {
			this.setState({ saving: false });
			console.log('error saving article:', error);
		});
	}

	render() {
		const { saving } = this.state;
		const { article } = this.props;
		console.log('>>>>>??', article);

		if (!isLoaded(article)) {
			return (
				<div className="LunaAdmin-Content-Collections-Article-New">
					<p>Loading </p>
				</div>
			);
		}

		return (
			<div className="LunaAdmin-Content-Collections-Article-New">
				<UpdateArticleForm 
					article={article}
					backLinkUrl="/admin/collections/article"
					saving={saving}
					onSave={this.handleSave}
					editable={true}
				/>
			</div>
		);
	}
}

export default CollectionsArticleNew;