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
import _ from 'lodash';

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
		const { id } = article;
		delete article[id];
		// return new Promise((resolve, reject) => {
		// 	resolve();
		// });
		return firestore.set(`/articles/${article.id}`, article);
	} 

	updateTagLinks(articleId, newTagsList) {
		return new Promise((resolve, reject) => {
			const { firestore, article } = this.props;
			const { tags: oldTagsList } = article;

			if (!_.isEqual(oldTagsList, newTagsList)) {
				const tagLinksToRemove = _.difference(oldTagsList, newTagsList);
				const tagLinksToAdd = _.difference(newTagsList, oldTagsList);

				const removeTagLinkRequests = tagLinksToRemove.map(tag => {
					return firestore.delete({ collection: `articles_tags`, doc: `${articleId}_${tag}` });
				});

				const addTagLinkRequests = tagLinksToAdd.map(tag => {
					return firestore.set(`/articles_tags/${articleId}_${tag}`, {
						articleId,
						tagId: tag
					});
				});

				const linkRequests = addTagLinkRequests.concat(removeTagLinkRequests);
				Promise.all(linkRequests)
					.then(() => {
						resolve();
					})
					.catch((error) => {
						reject(error);
					});
			} else {
				return resolve();
			}
		});
	}

	updateCountryLinks(articleId, newCountriesList) {
		return new Promise((resolve, reject) => {
			const { firestore, article } = this.props;
			const { countries: oldCountriesList } = article;

			if (!_.isEqual(oldCountriesList, newCountriesList)) {
				const countryLinksToRemove = _.difference(oldCountriesList, newCountriesList);
				const countryLinksToAdd = _.difference(newCountriesList, oldCountriesList);

				const removeCountryLinkRequests = countryLinksToRemove.map(country => {
					return firestore.delete({ collection: `articles_countries`, doc: `${articleId}_${country}` });
				});

				const addCountryLinkRequests = countryLinksToAdd.map(country => {
					return firestore.set(`/articles_countries/${articleId}_${country}`, {
						articleId,
						countryId: country
					});
				});

				const linkRequests = addCountryLinkRequests.concat(removeCountryLinkRequests);
				Promise.all(linkRequests)
					.then(() => {
						resolve();
					})
					.catch((error) => {
						reject(error);
					});
			} else {
				return resolve();
			}
		});
	}

	linkArticleWithTags(articleId, tags) {
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
		this.updateTagLinks(article.id, tags)
		.then(() => {
			return this.updateCountryLinks(article.id, countries);
		})
		.then(() => {
			return this.saveArticle(article)
		})
		.then(() => {
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