import React from 'react';
import GifForm from '../Gif/Container';

const UpdateGifForm = (props) => {
	const updatedProps = {
		...props,
		formTitle: 'Edit Gif',
		mode: 'edit'
	};

	return (
		<GifForm {...updatedProps} />
	);
};

export default UpdateGifForm;