import React from 'react';
import MemeForm from '../Meme/Container';

const UpdateMemeForm = (props) => {
	const updatedProps = {
		...props,
		formTitle: 'Edit Meme',
		mode: 'edit'
	};

	return (
		<MemeForm {...updatedProps} />
	);
};

export default UpdateMemeForm;