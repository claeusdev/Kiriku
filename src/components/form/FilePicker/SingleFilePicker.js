import React, { Component } from 'react';
import { ControlLabel } from 'react-bootstrap';
import { S3 } from '../../../utils/s3';
import classnames from 'classnames';
import UploadOutlineIcon from 'react-icons/lib/ti/upload-outline';
import './SingleFilePicker.css';

const THUMBNAILS_FOLDER_NAME = 'quiz-thumbnails';
const config = {
  bucketName: 'omg-quiz-assets',
  albumName: THUMBNAILS_FOLDER_NAME,
  region: 'eu-west-2',
  accessKeyId: 'AKIAJ6AAGEDRS2SO66HQ',
  secretAccessKey: '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',
}

class SingleFilePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previewImage: '',
      isUploadingImage: false
    };

    this.handleFileChange = this.handleFileChange.bind(this);
    this.uploadImageToS3 = this.uploadImageToS3.bind(this);
  }

  uploadImageToS3(image) {
    const { onFileChange } = this.props;

    S3.upload(image, config)
      .then((data) => {
        this.setState({ isUploadingImage: false });
        const fileLocation = data.location.replace('photos', THUMBNAILS_FOLDER_NAME);
        onFileChange(fileLocation)
      })
      .catch((err) => console.error('Error uploading image to s3', err))
  }

  handleFileChange(evt) {
    const input = evt.target;
    const { uploadOnSelect } = this.props;
    let image;

    if (input.files && input.files[0]) {
      image = input.files[0];
    }

    if (image) {
      var reader = new FileReader();

      reader.onload = (readEvt) => {
        const isUploadingImage = !!uploadOnSelect;
        this.setState({ previewImage: readEvt.target.result, isUploadingImage });
        if (uploadOnSelect) {
          this.uploadImageToS3(image);
        }
      }

      reader.readAsDataURL(image);
    }
  }

  render() {
    const { handleFileChange } = this;
    const { previewImage, isUploadingImage } = this.state;
    const { label, accept } = this.props;
    const prompt = (
      <div>
        <UploadOutlineIcon /> Choose an file
      </div>
    );
    return (
      <div className="FilePicker SingleFilePicker">
        {label && <ControlLabel>{label}</ControlLabel>}
        <div className="preview-area">
          {previewImage && 
          <img alt="thumbnail-preview" className="preview-image" src={this.state.previewImage} />}
          {!previewImage && 
          <span className="placeholder-text"> Select an image to preview </span>}
        </div>
        <label className={classnames('picker-button', {disabled: isUploadingImage})}>
          {isUploadingImage && 'Uploading ...'}
          {!isUploadingImage && prompt}
          <input type="file" accept={accept} onChange={handleFileChange} disabled={isUploadingImage} />
        </label>
      </div>
    );
  }
}

export default SingleFilePicker;
