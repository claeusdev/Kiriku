import React, { Component } from 'react';
import ImageOutlineIcon from 'react-icons/lib/ti/image-outline';
import './ImagePicker.css';

class ImagePicker extends Component {
  constructor(props) {
    super(props);
    this.handleImageChange = this.handleImageChange.bind(this);
  }

  handleImageChange(evt) {
    const input = evt.target;
    const { onChange } = this.props;
    let image;

    if (input.files && input.files[0]) {
      image = input.files[0];
    }

    onChange(image);
  }

  render() {
    const { handleImageChange } = this;
    const { fileInputElementId, previewImage, disabled } = this.props;
    const imageURL = `https://d1n92yndbf3pp5.cloudfront.net/fit-in/1000x500/quiz-assets/${previewImage}`;

    const onClick = () => {
      if (!disabled) {
        this.imagePickerRootElement.querySelector('input').click();
      }
    };

    return (
      <div 
        className="FilePicker ImagePicker"
        onClick={onClick}
        ref={(el) => { this.imagePickerRootElement = el; }}
      >
        {!previewImage && 
        <div className="placeholder-image">
          <ImageOutlineIcon />
        </div>
        }
        {previewImage && 
        <img alt="question reveal thumbnail" src={imageURL} className="preview-image"  />}
        <div className="file-input">
          <input 
            id={fileInputElementId}
            type="file" 
            accept="image/*"
            onChange={handleImageChange} 
          />
        </div>
      </div>
    );
  }
}

export default ImagePicker;
