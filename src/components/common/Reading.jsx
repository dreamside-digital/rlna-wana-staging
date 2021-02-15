import React from "react";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import {
  PlainTextEditor,
  RichTextEditor,
  FileUploadEditor,
  LinkEditor,
  Editable
} from 'react-easy-editables';

import T from "./Translation";
import { uploadFile } from "../../firebase/operations"

class GalleryEditor extends React.Component {
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
      <Card className={`reading-item ${this.props.classes}`} variant="outlined" square={true}>
        <CardContent className="card-body">
          <div className="card-title">
            <h4 className="text-primary">
              <PlainTextEditor
                content={content["reading-item-title"]}
                handleEditorChange={this.handleEditorChange("reading-item-title")}
              />
            </h4>
          </div>

          <div className="author">
            <PlainTextEditor
              content={content["reading-item-details"]}
              handleEditorChange={this.handleEditorChange("reading-item-details")}
            />
          </div>

          <div className="card-text" style={{ color: "#000000"}}>
            <RichTextEditor
              content={content["reading-item-description"]}
              handleEditorChange={this.handleEditorChange("reading-item-description")}
            />
          </div>

          <div className="link" style={{ marginBottom: "1rem" }}>
            <LinkEditor
              content={content["reading-item-link"]}
              handleEditorChange={this.handleEditorChange("reading-item-link")}
            />
          </div>

          <div className="file">
            <FileUploadEditor
              content={content["reading-item-file"]}
              handleEditorChange={this.handleEditorChange("reading-item-file")}
              uploadFile={uploadFile}
            />
          </div>
        </CardContent>
      </Card>
    )
  }
}

const Gallery = props => {

  const content = props.content || {};

  const handleSave = newContent => {
    props.onSave(newContent)
  }

  return (
    <Editable
      Editor={GalleryEditor}
      handleSave={handleSave}
      content={content}
      {...props}
    >
      <Card className={`reading-item ${props.classes}`} variant="outlined" square={true}>
        <CardContent className="card-body">
          <div className="card-title">
            <h4 className="text-primary">
              { content["reading-item-title"]["text"] }
            </h4>
          </div>

          <div className="author">
            {content["reading-item-details"]["text"]}
          </div>

          <div className="description" dangerouslySetInnerHTML={ {__html: content["reading-item-description"]["text"]} } />

          {
            Boolean(content["reading-item-link"]) && Boolean(content["reading-item-link"]["link"]) &&
            <div className="file-link">
              <a href={content["reading-item-link"]["link"]} target="_blank" rel="noopener noreferrer">
                { content["reading-item-link"]["anchor"] ? content["reading-item-link"]["anchor"] : "Open link" }
              </a>
            </div>
          }

          {
            Boolean(content["reading-item-file"]) &&
            <div className="file-link">
              <a href={content["reading-item-file"]["filepath"]} target="_blank" rel="noopener noreferrer">
                <T id="open_pdf" />
              </a>
            </div>
          }
        </CardContent>
      </Card>
    </Editable>
  );
};

Gallery.defaultProps = {
  content: {
    "reading-item-details": { "text": "Author" },
    "reading-item-title": { "text": "Title" },
    "reading-item-description": { "text": "Summary" }
  },
  classes: "",
  onSave: () => { console.log('implement a function to save changes') }
}

export default Gallery;
