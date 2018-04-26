import React, { Component } from 'react';
import ReactFilestack from 'filestack-react';
import ImagePickerIcon from 'react-icons/lib/ti/image';
import './style.css';

export default class SingleImagePicker extends Component {
	constructor(props) {
		super(props);

		const { previewUrl } = props;
		this.state = {
			previewUrl: previewUrl || ''
		};

		this.setButtonTriggerRef = element => {
      this.buttonTrigger = element;
    };
	}

	render() {
		const { onFileUpload } = this.props;
		const { previewUrl } = this.state;

		const ImagePreview = (
			<div className="Apollo-SingleImagePickerPreview">
				<img src={previewUrl} className="Apollo-SingleImagePicker-PreviewImage" />
			</div>
		);

		const triggerButtonContent = previewUrl ? ImagePreview : <ImagePickerIcon />;

		return (
			<div className="Apollo-SingleImagePicker">
				<ReactFilestack
					ref={this.setButtonTriggerRef}
					apikey="AWHeZdEISLmyyCOaFE0qwz"
					buttonText={triggerButtonContent}
					buttonClass="Apollo-SingleImagePicker-Trigger"
					options={{}}
					onSuccess={(result) => {
						const uploadedFile = result.filesUploaded[0] || {};
						this.setState({ previewUrl: uploadedFile.url });
						onFileUpload(uploadedFile.url);
					}}
				/>
			</div>
		);
	}
}