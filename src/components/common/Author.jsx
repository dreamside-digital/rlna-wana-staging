import React from "react";

import {
  PlainTextEditor,
  ImageUploadEditor,
  Editable
} from 'react-easy-editables';

import { uploadImage } from "../../firebase/operations"

class AuthorEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { content: this.props.content };
  }

  handleEditorChange = field => item => {
    this.setState({
      content: {
        ...this.state.content,
        [field]: {
          ...item
        }
      }
    });
  }

  render() {
    const { content } = this.state;

    return(
      <div className="video-author">
        <ImageUploadEditor
          content={content[`author-item-image`]}
          handleEditorChange={this.handleEditorChange(`author-item-image`)}
          uploadImage={uploadImage}
        />
        <h4>
          <PlainTextEditor
            content={content[`author-item-name`]}
            handleEditorChange={this.handleEditorChange(`author-item-name`)}
          />
        </h4>
        <PlainTextEditor
          content={content[`author-item-bio`]}
          handleEditorChange={this.handleEditorChange(`author-item-bio`)}
        />
      </div>
    )
  }
}

const Author = props => {

  const content = props.content || {};

  const handleSave = newContent => {
    props.onSave(newContent)
  }

  return (
    <Editable
      Editor={AuthorEditor}
      handleSave={handleSave}
      content={content}
      {...props}
    >
      <div className="video-author">
        <div className="image-rounded">
          <img src={content[`author-item-image`]["imageSrc"]} alt={content[`author-item-name`]["text"]} />
        </div>
        <h4>
          {content[`author-item-name`]["text"]}
        </h4>
        <p>{content[`author-item-bio`]["text"]}</p>
      </div>
    </Editable>
  );
};

Author.defaultProps = {
  content: {
    "author-item-image": { "imageSrc": "" },
    "author-item-name": { "text": "Author" },
    "author-item-bio": { "text": "Bio" }
  },
  classes: "",
  onSave: () => { console.log('implement a function to save changes') }
}


export default Author;
