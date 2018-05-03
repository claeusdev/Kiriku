import React from 'react';
import MemeForm from '../Meme/Container';

const UpdateMemeForm = (props) => {
	const updatedProps = {
		...props,
		formTitle: 'Edit Meme'
	};

	return (
		<MemeForm {...updatedProps} />
	);
};

export default UpdateMemeForm;