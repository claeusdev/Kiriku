import React from 'react';
import ArticleForm from '../Article/Container';

const UpdateArticleForm = (props) => {
	const updatedProps = {
		...props,
		formTitle: 'Edit Article',
		mode: 'edit'
	};

	return (
		<ArticleForm {...updatedProps} />
	);
};

export default UpdateArticleForm;