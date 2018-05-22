// collections/gif/show

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
import { UpdateGifForm } from '../../../../../forms';
import _ from 'lodash';

import {
  isLoaded
} from 'react-redux-firebase'

import './style.css';

class CollectionsGifNew extends Component {
	constructor(props) {
		super(props);

		this.state = {
			saving: false
		};

		this.handleSave = this.handleSave.bind(this);
		this.saveGif = this.saveGif.bind(this);
		this.updateCountryLinks = this.updateCountryLinks.bind(this);
		this.updateTagLinks = this.updateTagLinks.bind(this);
	}
	
	// saveGif(gif) {
	// 	const { firestore } = this.props;
	// 	return firestore.add('gifs', gif)
	// } linkGifWithTags(gifId, tags) {
	// 	return new Promise((resolve, reject) => {
	// 		const { firestore } = this.props;

	// 		const linkTagRequests = tags.map(tag => {
	// 			return firestore.set(`/gifs_tags/${gifId}_${tag}`, {
	// 				gifId,
	// 				tagId: tag
	// 			});
	// 		});

	// 		Promise.all(linkTagRequests)
	// 			.then(() => {
	// 				resolve(gifId);
	// 			})
	// 			.catch((error) => {
	// 				reject(error);
	// 			});
	// 	});
	// }

	// linkGifWithCountries(gifId, countries) {
	// 	const { firestore } = this.props;

	// 	const linkCountryRequests = countries.map(country => {
	// 		return firestore.set(`/gifs_countries/${gifId}_${country}`, {
	// 			gifId,
	// 			countryId: country
	// 		});
	// 	});

	// 	return Promise.all(linkCountryRequests)
	// }

	// handleSave(gif) {
	// 	const { firestore, onSave } = this.props;

	// 	gif.tags = gif.tags.map(tag => tag.value);
	// 	gif.countries = gif.countries.map(countrie => countrie.value);

	// 	const { tags, countries } = gif;

	// 	this.setState({ saving: true });
	// 	this.saveGif(gif)
	// 	.then((savedGif) => {
	// 		const savedGifId = savedGif._key.path.segments[1]
	// 		return this.linkGifWithTags(savedGifId, tags);
	// 	})
	// 	.then((savedGifId) => {
	// 		return this.linkGifWithCountries(savedGifId, countries);
	// 	})
	// 	.then((result) => {
	// 		this.setState({ saving: false });
	// 		onSave();
	// 	})
	// 	.catch((error) => {
	// 		this.setState({ saving: false });
	// 		console.log('error saving gif:', error);
	// 	});
	// }



	saveGif(gif) {
		const { firestore } = this.props;
		const { id } = gif;
		delete gif[id];
		return firestore.set(`/gifs/${gif.id}`, gif);
	} 

	updateTagLinks(gifId, newTagsList) {
		return new Promise((resolve, reject) => {
			const { firestore, gif } = this.props;
			const { tags: oldTagsList } = gif;

			if (!_.isEqual(oldTagsList, newTagsList)) {
				const tagLinksToRemove = _.difference(oldTagsList, newTagsList);
				const tagLinksToAdd = _.difference(newTagsList, oldTagsList);

				const removeTagLinkRequests = tagLinksToRemove.map(tag => {
					return firestore.delete({ collection: `gifs_tags`, doc: `${gifId}_${tag}` });
				});

				const addTagLinkRequests = tagLinksToAdd.map(tag => {
					return firestore.set(`/gifs_tags/${gifId}_${tag}`, {
						gifId,
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

	updateCountryLinks(gifId, newCountriesList) {
		return new Promise((resolve, reject) => {
			const { firestore, gif } = this.props;
			const { countries: oldCountriesList } = gif;

			if (!_.isEqual(oldCountriesList, newCountriesList)) {
				const countryLinksToRemove = _.difference(oldCountriesList, newCountriesList);
				const countryLinksToAdd = _.difference(newCountriesList, oldCountriesList);

				const removeCountryLinkRequests = countryLinksToRemove.map(country => {
					return firestore.delete({ collection: `gifs_countries`, doc: `${gifId}_${country}` });
				});

				const addCountryLinkRequests = countryLinksToAdd.map(country => {
					return firestore.set(`/gifs_countries/${gifId}_${country}`, {
						gifId,
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

	handleSave(gif) {
		const { firestore, onSave } = this.props;

		gif.tags = gif.tags.map(tag => tag.value);
		gif.countries = gif.countries.map(countrie => countrie.value);

		const { tags, countries } = gif;

		this.setState({ saving: true });

		this.updateTagLinks(gif.id, tags)
		.then(() => {
			return this.updateCountryLinks(gif.id, countries);
		})
		.then(() => {
			return this.saveGif(gif)
		})
		.then(() => {
			this.setState({ saving: false });
			onSave();
		})
		.catch((error) => {
			this.setState({ saving: false });
			console.log('error saving gif:', error);
		});
	}

	render() {
		const { saving } = this.state;
		const { gif } = this.props;

		if (!isLoaded(gif)) {
			return (
				<div className="LunaAdmin-Content-Collections-Gif-New">
					<p>Loading </p>
				</div>
			);
		}

		return (
			<div className="LunaAdmin-Content-Collections-Gif-New">
				<UpdateGifForm 
					gif={gif}
					backLinkUrl="/admin/collections/gif"
					saving={saving}
					onSave={this.handleSave}
					editable={true}
				/>
			</div>
		);
	}
}

export default CollectionsGifNew;