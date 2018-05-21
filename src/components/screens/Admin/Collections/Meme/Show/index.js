// collections/meme/show

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
import { UpdateMemeForm } from '../../../../../forms';
import _ from 'lodash';

import {
  isLoaded
} from 'react-redux-firebase'

import './style.css';

class CollectionsMemeNew extends Component {
	constructor(props) {
		super(props);

		this.state = {
			saving: false
		};

		this.handleSave = this.handleSave.bind(this);
		this.saveMeme = this.saveMeme.bind(this);
		this.updateCountryLinks = this.updateCountryLinks.bind(this);
		this.updateTagLinks = this.updateTagLinks.bind(this);
	}

	saveMeme(meme) {
		const { firestore } = this.props;
		const { id } = meme;
		delete meme[id];
		return firestore.set(`/memes/${meme.id}`, meme);
	} 

	updateTagLinks(memeId, newTagsList) {
		return new Promise((resolve, reject) => {
			const { firestore, meme } = this.props;
			const { tags: oldTagsList } = meme;

			if (!_.isEqual(oldTagsList, newTagsList)) {
				const tagLinksToRemove = _.difference(oldTagsList, newTagsList);
				const tagLinksToAdd = _.difference(newTagsList, oldTagsList);

				const removeTagLinkRequests = tagLinksToRemove.map(tag => {
					return firestore.delete({ collection: `memes_tags`, doc: `${memeId}_${tag}` });
				});

				const addTagLinkRequests = tagLinksToAdd.map(tag => {
					return firestore.set(`/memes_tags/${memeId}_${tag}`, {
						memeId,
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

	updateCountryLinks(memeId, newCountriesList) {
		return new Promise((resolve, reject) => {
			const { firestore, meme } = this.props;
			const { countries: oldCountriesList } = meme;

			if (!_.isEqual(oldCountriesList, newCountriesList)) {
				const countryLinksToRemove = _.difference(oldCountriesList, newCountriesList);
				const countryLinksToAdd = _.difference(newCountriesList, oldCountriesList);

				const removeCountryLinkRequests = countryLinksToRemove.map(country => {
					return firestore.delete({ collection: `memes_countries`, doc: `${memeId}_${country}` });
				});

				const addCountryLinkRequests = countryLinksToAdd.map(country => {
					return firestore.set(`/memes_countries/${memeId}_${country}`, {
						memeId,
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

	handleSave(meme) {
		const { firestore, onSave } = this.props;

		meme.tags = meme.tags.map(tag => tag.value);
		meme.countries = meme.countries.map(countrie => countrie.value);

		const { tags, countries } = meme;

		this.setState({ saving: true });

		this.updateTagLinks(meme.id, tags)
		.then(() => {
			return this.updateCountryLinks(meme.id, countries);
		})
		.then(() => {
			return this.saveMeme(meme)
		})
		.then(() => {
			this.setState({ saving: false });
			onSave();
		})
		.catch((error) => {
			this.setState({ saving: false });
			console.log('error saving meme:', error);
		});
	}

	render() {
		const { saving } = this.state;
		const { meme } = this.props;

		if (!isLoaded(meme)) {
			return (
				<div className="LunaAdmin-Content-Collections-Meme-New">
					<p>Loading </p>
				</div>
			);
		}

		return (
			<div className="LunaAdmin-Content-Collections-Meme-New">
				<UpdateMemeForm 
					meme={meme}
					backLinkUrl="/admin/collections/meme"
					saving={saving}
					onSave={this.handleSave}
					editable={true}
				/>
			</div>
		);
	}
}

export default CollectionsMemeNew;