import React from "react";
import Grid from '@material-ui/core/Grid';

import {
  PlainTextEditor,
  ImageUploadEditor,
  Editable
} from 'react-easy-editables';

import { uploadImage } from "../../firebase/operations"


class QuoteEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { content: this.props.content };
  }

  handleEditorChange = field => item => {
    console.log("field", field)
    console.log("item", item)
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
      <div className={`quote ${this.props.classes}`}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4} className="d-flex justify-center">
            <div className="headshot">
              <ImageUploadEditor
                content={content["image"]}
                handleEditorChange={this.handleEditorChange("image")}
                uploadImage={uploadImage}
              />
            </div>
          </Grid>
          <Grid item xs={12} sm={8}>
            <div className="box">
              <PlainTextEditor
                className="quote-text"
                content={content["quote-text"]}
                handleEditorChange={this.handleEditorChange("quote-text")}
              />
              <PlainTextEditor
                className="author"
                content={content["author"]}
                handleEditorChange={this.handleEditorChange("author")}
              />
              <PlainTextEditor
                className="position"
                content={content["position"]}
                handleEditorChange={this.handleEditorChange("position")}
              />
            </div>
          </Grid>
        </Grid>
      </div>
    )
  }
}

const Quote = props => {

  const content = props.content || {};

  const handleSave = newContent => {
    props.onSave(newContent)
  }

  return (
    <Editable
      Editor={QuoteEditor}
      handleSave={handleSave}
      content={content}
      {...props}
    >
      <div className={`quote ${props.classes}`}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4} className="d-flex justify-center">
            <div className="headshot">
              <img src={content["image"]["imageSrc"]} className="rounded" alt={content["image"]["caption"]} />
            </div>
          </Grid>
          <Grid item xs={12} sm={8}>
            <div className="box">
              <p className="quote-text">{content["quote-text"]["text"]}</p>
              <p className="author bold">{content["author"]["text"]}</p>
              <p className="position">{content["position"]["text"]}</p>
            </div>
          </Grid>
        </Grid>
      </div>
    </Editable>
  );
};

Quote.defaultProps = {
  content: {
    image: { imageSrc: "" },
    "quote-text": { text: "Quote text" },
    author: { text: "Author" },
    position: { text: "Position or organization" }
  },
  classes: "",
  onSave: () => { console.log('implement a function to save changes') }
}

export default Quote;
